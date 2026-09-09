from flask import Flask, request, jsonify
from flask_cors import CORS

from recommendation_engine import recommend, build_study_path, load_resources

app = Flask(__name__)
CORS(app)

VALID_LEVELS = {"beginner", "basics", "intermediate", "advanced"}
VALID_GOALS = {"exam", "concept", "practice", "project", "interview", "explore"}
VALID_FORMATS = {"video", "article", "interactive", "practice", "notes"}
VALID_DIFFICULTIES = {"easy", "moderate", "challenging"}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "resource_count": len(load_resources())})


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
