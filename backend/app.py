from flask import Flask, request, jsonify
from flask_cors import CORS

from recommendation_engine import recommend, build_study_path, load_resources
from learning_features import enrich_resources, extract_intent, search, time_plan, dashboard, SYLLABUS

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
