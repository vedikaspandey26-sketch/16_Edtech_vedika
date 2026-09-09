from flask import Flask, request, jsonify
from flask_cors import CORS

from recommendation_engine import recommend, build_study_path, load_resources
from learning_features import enrich_resources, extract_intent, search, time_plan, dashboard, SYLLABUS, mock_login, USERS, generate_quiz, submit_quiz, chart_data, generate_roadmap, ROADMAPS

app = Flask(__name__)
CORS(app)

VALID_LEVELS = {"beginner", "basics", "intermediate", "advanced"}
VALID_GOALS = {"exam", "concept", "practice", "project", "interview", "explore"}
VALID_FORMATS = {"video", "article", "interactive", "practice", "notes"}
VALID_DIFFICULTIES = {"easy", "moderate", "challenging"}
SMART_SEARCH_CACHE = {}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "resource_count": len(load_resources())})


def feature_resources():
    return enrich_resources(load_resources())


@app.route("/api/resources", methods=["GET"])
def api_resources():
    filters = {key: request.args.get(key) for key in ("type", "topic", "level", "syllabusModuleId")}
    return jsonify({"resources": search(feature_resources(), "", {"topic": filters.get("topic") or ""}, filters)})


@app.route("/api/search/smart", methods=["POST"])
def api_smart_search():
    payload = request.get_json(silent=True) or {}
    query = (payload.get("query") or "").strip()
    if not query: return jsonify({"error": "Enter a topic or learning question."}), 400
    intent = payload.get("intent") or SMART_SEARCH_CACHE.get(query.lower()) or extract_intent(query)
    SMART_SEARCH_CACHE[query.lower()] = intent
    app.logger.info("smart-search topic=%s goal=%s urgency=%s", intent["topic"], intent["goal"], intent["urgency"])
    return jsonify({"intent": intent, "results": search(feature_resources(), query, intent, payload.get("filters"))})


@app.route("/api/plan/time-based", methods=["POST"])
def api_time_plan():
    payload = request.get_json(silent=True) or {}
    try: total = max(5, int(payload.get("minutesAvailable", 20)))
    except (TypeError, ValueError): total = 20
    return jsonify(time_plan(feature_resources(), (payload.get("topic") or "Arrays").strip(), total))


@app.route("/api/syllabus/tree", methods=["GET"])
def api_syllabus():
    parent = request.args.get("parentId")
    if not parent: return jsonify({"children": SYLLABUS["universities"]})
    children = [node for nodes in SYLLABUS.values() for node in nodes if node.get("parentId") == parent]
    return jsonify({"children": children})


@app.route("/api/dashboard/<user_id>", methods=["GET"])
def api_dashboard(user_id):
    data = dashboard(); data["userId"] = user_id
    return jsonify(data)


@app.route("/api/dashboard/<user_id>/charts", methods=["GET"])
def api_charts(user_id): return jsonify(chart_data(user_id))


@app.route("/api/auth/mock-login", methods=["POST"])
def api_mock_login():
    payload = request.get_json(silent=True) or {}; name = (payload.get("name") or "").strip(); email = (payload.get("email") or "").strip()
    if email.lower() == "demo@studymate.ai": name = name or "Ava Sharma"
    if not name or "@" not in email: return jsonify({"error": "Enter your name and a valid email."}), 400
    return jsonify(mock_login(name, email))


@app.route("/api/users/<user_id>", methods=["GET", "PUT"])
def api_user(user_id):
    if request.method == "GET": return jsonify(USERS.get(user_id) or {"error": "User not found"}), (200 if user_id in USERS else 404)
    if user_id not in USERS: return jsonify({"error": "User not found"}), 404
    payload = request.get_json(silent=True) or {}; user = USERS[user_id]
    user["name"] = payload.get("name", user["name"]); user["preferences"].update(payload.get("preferences", {})); return jsonify(user)


@app.route("/api/quiz/generate", methods=["POST"])
def api_quiz_generate():
    p = request.get_json(silent=True) or {}
    count = min(10, max(1, int(p.get("numQuestions", 5))))
    return jsonify(generate_quiz(p.get("topic") or "General Learning", p.get("level") or "Beginner", count))


@app.route("/api/quiz/submit", methods=["POST"])
def api_quiz_submit(): return jsonify(submit_quiz(request.get_json(silent=True) or {}))


@app.route("/api/roadmap/generate", methods=["POST"])
def api_roadmap_generate():
    p = request.get_json(silent=True) or {}; goal = (p.get("goal") or "").strip()
    if not goal: return jsonify({"error": "Enter a learning goal."}), 400
    roadmap = generate_roadmap(feature_resources(), goal, int(p.get("timeframeWeeks") or 6)); roadmap["userId"] = p.get("userId"); ROADMAPS[roadmap["id"]] = roadmap; return jsonify(roadmap)


@app.route("/api/roadmap/<roadmap_id>/node/<node_id>", methods=["PATCH"])
def api_roadmap_node(roadmap_id, node_id):
    roadmap = ROADMAPS.get(roadmap_id)
    if not roadmap: return jsonify({"error": "Roadmap not found"}), 404
    for node in roadmap["nodes"]:
        if node["id"] == node_id: node["completed"] = not node["completed"]
    for parent in roadmap["nodes"]:
        children = [n for n in roadmap["nodes"] if n.get("parentId") == parent["id"]]
        if children: parent["completed"] = all(n["completed"] for n in children)
    return jsonify(roadmap)


@app.route("/api/recommend", methods=["POST"])
def api_recommend():
    payload = request.get_json(silent=True) or {}

    subject = (payload.get("subject") or "").strip()
    topic = (payload.get("topic") or "").strip()

    if not subject and not topic:
        return jsonify({
            "error": "Please tell us at least a subject or a topic so we know what to look for."
        }), 400

    level = payload.get("level") or "beginner"
    if level not in VALID_LEVELS:
        level = "beginner"

    goal = payload.get("goal") or "concept"
    if goal not in VALID_GOALS:
        goal = "concept"

    formats = [f for f in (payload.get("formats") or []) if f in VALID_FORMATS]

    difficulty = payload.get("difficulty") or "moderate"
    if difficulty not in VALID_DIFFICULTIES:
        difficulty = "moderate"

    try:
        time_minutes = int(payload.get("time") or 30)
    except (TypeError, ValueError):
        time_minutes = 30

    profile = {
        "subject": subject,
        "topic": topic,
        "level": level,
        "goal": goal,
        "formats": formats,
        "time": time_minutes,
        "difficulty": difficulty,
        "academic_level": payload.get("academic_level", ""),
    }

    recommendations = recommend(profile, top_n=5)
    study_path = build_study_path(recommendations)

    return jsonify({
        "profile": profile,
        "recommendations": recommendations,
        "study_path": study_path,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
