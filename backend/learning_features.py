"""Demo-safe feature services for search, syllabus, plans and dashboard data."""
import re
import uuid
from datetime import date

TYPE_BY_FORMAT = {"article": "text", "notes": "text", "video": "video", "practice": "practice", "interactive": "interactive"}
SUBTYPE_BY_FORMAT = {"article": "article", "notes": "notes", "video": "youtube_lecture", "practice": "coding_problem", "interactive": "visualization"}
LEVEL_TITLE = {"beginner": "Beginner", "basics": "Beginner", "intermediate": "Intermediate", "advanced": "Advanced"}

SYLLABUS = {
    "universities": [{"id": "demo-university", "name": "StudyMate Demo University"}],
    "semesters": [{"id": "semester-1", "name": "Semester 1", "parentId": "demo-university"}],
    "subjects": [{"id": "data-structures", "name": "Data Structures", "parentId": "semester-1"}],
    "modules": [
        {"id": "module-1", "name": "Module 1 · Linear structures", "parentId": "data-structures"},
        {"id": "module-2", "name": "Module 2 · Trees & graphs", "parentId": "data-structures"},
    ],
    "topics": [
        {"id": "arrays", "name": "Arrays", "parentId": "module-1"},
        {"id": "linked-lists", "name": "Linked Lists", "parentId": "module-1"},
        {"id": "recursion", "name": "Recursion", "parentId": "module-2"},
        {"id": "trees", "name": "Trees", "parentId": "module-2"},
    ],
}
USERS, QUIZ_ATTEMPTS, ROADMAPS = {}, [], {}

def mock_login(name, email):
    user = next((u for u in USERS.values() if u["email"].lower() == email.lower()), None)
    if not user:
        user = {"id": str(uuid.uuid4()), "name": name, "email": email, "avatarSeed": name or email, "createdAt": str(date.today()), "preferences": {"defaultLevel": "Beginner", "subjects": [], "dailyMinutes": 20}}
        USERS[user["id"]] = user
    return {**user, "userId": user["id"], "token": f"mock-{uuid.uuid4()}"}

QUESTION_BANK = {
    "python": [("Which keyword defines a function in Python?", ["def", "func", "function", "define"], 0), ("What does len([1, 2, 3]) return?", ["3", "2", "[3]", "Error"], 0), ("Which collection stores key-value pairs?", ["dict", "list", "tuple", "set"], 0), ("What is the result of 7 // 2?", ["3", "3.5", "4", "Error"], 0), ("Which statement starts a conditional block?", ["if", "for", "def", "import"], 0)],
    "arrays": [("What is the first valid index of a typical array?", ["0", "1", "-1", "It varies"], 0), ("Which operation is usually O(1) for an array?", ["Access by index", "Insert at start", "Search unsorted", "Delete at start"], 0)],
    "recursion": [("What is essential in a recursive function?", ["A base case", "A global variable", "A loop", "A class"], 0), ("Recursion solves a problem by…", ["calling itself on a smaller case", "only using arrays", "avoiding functions", "sorting first"], 0)],
    "trees": [("A tree node with no children is a…", ["leaf", "root", "edge", "branch"], 0), ("A binary tree node has at most…", ["two children", "one child", "three children", "unlimited children"], 0)],
}

def generate_quiz(topic, level, count):
    bank = QUESTION_BANK.get(topic.lower(), [(f"Which statement best describes {topic}?", [f"A core concept to understand", "A database", "A browser", "A file type"], 0), (f"What is a good way to learn {topic}?", ["Study examples and practise", "Skip the basics", "Memorize without context", "Avoid feedback"], 0)])
    questions = []
    for i in range(count):
        q, options, correct = bank[i % len(bank)]
        questions.append({"id": f"q{i + 1}", "question": q, "options": options, "correctIndex": correct, "explanation": f"This is the key {topic} concept tested by this question."})
    return {"questions": questions, "source": "static-bank"}

def submit_quiz(payload):
    questions, answers = payload.get("questions", []), payload.get("answers", [])
    selected = {a.get("questionId"): a.get("selectedIndex") for a in answers}
    checked = [{"questionId": q["id"], "selectedIndex": selected.get(q["id"]), "correct": selected.get(q["id"]) == q["correctIndex"]} for q in questions]
    score = round(100 * sum(x["correct"] for x in checked) / len(questions)) if questions else 0
    attempt = {"id": str(uuid.uuid4()), "userId": payload.get("userId"), "topic": payload.get("topic"), "level": payload.get("level"), "score": score, "answers": checked, "source": payload.get("source", "static-bank"), "attemptedAt": str(date.today())}
    QUIZ_ATTEMPTS.append(attempt); return {"score": score, "answers": checked, "attempt": attempt, "xpAwarded": 20 if score >= 70 else 0}

def chart_data(user_id):
    attempts = [a for a in QUIZ_ATTEMPTS if a["userId"] == user_id][-10:]
    topic_scores = {}
    for a in attempts: topic_scores.setdefault(a["topic"], []).append(a["score"])
    return {"quizTrend": [{"date": a["attemptedAt"], "score": a["score"]} for a in attempts], "resourcesByType": [{"type": k, "count": v} for k, v in {"text": 3, "video": 4, "practice": 3, "interactive": 2}.items()], "weeklyActivity": [{"day": day, "count": count} for day, count in zip(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], [1, 2, 1, 3, 2, 0, 1])], "topicStrength": [{"topic": topic, "avgScore": round(sum(scores) / len(scores))} for topic, scores in topic_scores.items()]}

def generate_roadmap(resources, goal, weeks):
    title = f"{goal.strip().title()} roadmap"; topics = ["Arrays", "Linked Lists", "Recursion", "Trees"] if any(x in goal.lower() for x in ("data structure", "placement")) else ["Python Basics", "Arrays", "Recursion"]
    nodes = [{"id": "goal", "label": title, "parentId": None, "order": 0, "estimatedHours": weeks * 4, "completed": False}]
    for i, topic in enumerate(topics):
        matches = sum(topic.lower() in r.get("topic", "").lower() for r in resources)
        nodes.append({"id": f"topic-{i}", "label": topic, "parentId": "goal", "order": i + 1, "estimatedHours": max(2, weeks), "completed": False, "resourceCount": matches})
        nodes.append({"id": f"practice-{i}", "label": f"Practise {topic}", "parentId": f"topic-{i}", "order": i + 1, "estimatedHours": 2, "completed": False, "resourceCount": matches})
    return {"id": str(uuid.uuid4()), "title": title, "goal": goal, "estimatedWeeks": weeks, "nodes": nodes, "createdAt": str(date.today())}

def _slug(value):
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")

def enrich_resources(resources):
    """Keep legacy cards working while exposing the Feature 2 resource contract."""
    result = []
    for raw in resources:
        item = dict(raw)
        item["type"] = TYPE_BY_FORMAT.get(item.get("format"), "text")
        item["subtype"] = SUBTYPE_BY_FORMAT.get(item.get("format"), "article")
        item["level"] = LEVEL_TITLE.get(item.get("knowledge_level"), "Beginner")
        item["durationMinutes"] = item.get("estimated_time", 15)
        item["difficultyScore"] = {"easy": 25, "moderate": 55, "challenging": 80}.get(item.get("difficulty"), 50)
        item["createdAt"] = "2026-01-01T00:00:00Z"
        item["syllabusTags"] = {"university": "demo-university", "semester": "semester-1", "subject": "data-structures", "module": "module-1" if item.get("topic") in ("Arrays", "Linked Lists") else "module-2"}
        result.append(item)
    return result + generated_resources(result)

def generated_resources(existing):
    """Completes the demo matrix for Arrays, Recursion and Trees across all four types."""
    known = {(r.get("topic"), TYPE_BY_FORMAT.get(r.get("format"))) for r in existing}
    items = []
    templates = {
        "text": ("Guided notes", "notes", "notes", 10),
        "video": ("Visual lecture", "video", "youtube_lecture", 18),
        "practice": ("Practice quiz", "practice", "quiz", 15),
        "interactive": ("Interactive explorer", "interactive", "simulation", 12),
    }
    for topic in ("Arrays", "Recursion", "Trees"):
        for kind, (label, legacy_format, subtype, minutes) in templates.items():
            if (topic, kind) in known: continue
            module = "module-1" if topic == "Arrays" else "module-2"
            items.append({"id": f"seed-{_slug(topic)}-{kind}", "title": f"{topic} {label}", "platform": "StudyMate Library", "subject": "Data Structures & Algorithms", "topic": topic, "format": legacy_format, "type": kind, "subtype": subtype, "difficulty": "easy", "knowledge_level": "beginner", "level": "Beginner", "goals": ["concept", "exam", "practice"], "estimated_time": minutes, "durationMinutes": minutes, "credibility": "High", "url": "https://example.com", "description": f"A focused {kind} resource for learning {topic}.", "difficultyScore": 30, "createdAt": "2026-01-01T00:00:00Z", "syllabusTags": {"university": "demo-university", "semester": "semester-1", "subject": "data-structures", "module": module}})
    return items

def extract_intent(query):
    q = query.lower()
    topics = ["recursion", "arrays", "trees", "linked lists", "binary search", "python", "calculus", "oop"]
    topic = next((t.title() if t != "oop" else "OOP" for t in topics if t in q), query.strip().title() or "General learning")
    level = "Beginner" if any(x in q for x in ("don't understand", "dont understand", "new to", "beginner")) else "Advanced" if "advanced" in q else "Intermediate"
    goal = "Interview Prep" if "interview" in q else "Assignment" if "assignment" in q else "Revision" if "revision" in q else "Exam" if any(x in q for x in ("exam", "test", "tomorrow")) else "General Learning"
    urgency = "High" if any(x in q for x in ("tomorrow", "urgent", "tonight", "asap")) else "Medium" if "week" in q else "Low"
    return {"topic": topic, "level": level, "goal": goal, "urgency": urgency}

def search(resources, query, intent=None, filters=None):
    intent = intent or extract_intent(query)
    filters = filters or {}
    needles = [x for x in re.findall(r"[a-z0-9]+", (query + " " + intent["topic"]).lower()) if len(x) > 2]
    ranked = []
    for r in resources:
        haystack = " ".join(str(r.get(k, "")) for k in ("title", "topic", "subject", "description")).lower()
        score = sum(n in haystack for n in needles)
        if filters.get("type") and filters["type"] != "all" and r.get("type") != filters["type"]: continue
        if filters.get("topic") and filters["topic"].lower() not in r.get("topic", "").lower(): continue
        if filters.get("level") and filters["level"] != "all" and r.get("level") != filters["level"]: continue
        if filters.get("syllabusModuleId") and r.get("syllabusTags", {}).get("module") != filters["syllabusModuleId"]: continue
        if score: ranked.append((score, r))
    if not ranked: ranked = [(0, r) for r in resources]
    return [r for _, r in sorted(ranked, key=lambda pair: pair[0], reverse=True)[:20]]

def time_plan(resources, topic, total):
    ratios = [("Concept explanation", "text", .25), ("Video", "video", .50), ("Quiz", "practice", .25)] if total <= 20 else [("Concept explanation", "text", .20), ("Video", "video", .35), ("Examples", "interactive", .20), ("Practice", "practice", .15), ("Quiz", "practice", .10)]
    minutes = [round(total * row[2]) for row in ratios]
    minutes[-1] += total - sum(minutes)
    blocks = []
    for (activity, kind, _), slot in zip(ratios, minutes):
        candidates = [r for r in resources if r.get("topic", "").lower() == topic.lower() and r.get("type") == kind and r.get("durationMinutes", 0) <= slot]
        best = max(candidates, key=lambda r: r.get("durationMinutes", 0), default=None)
        blocks.append({"activity": activity, "minutes": slot, "resourceId": best and best["id"], "resource": best})
    return {"totalMinutes": total, "blocks": blocks}

def dashboard():
    # A local demo profile; real products replace these aggregates with completion and quiz tables.
    return {"userId": "demo-user", "topicsStudied": 6, "resourcesCompleted": 12, "quizAverage": 78, "learningStreakDays": 4, "strongTopics": ["Arrays", "Linked Lists"], "needsAttentionTopics": ["Trees", "Recursion"], "lastActiveDate": str(date.today()), "xp": 285, "badges": ["First resource", "7-Day Streak"]}
