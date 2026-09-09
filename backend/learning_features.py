"""Demo-safe feature services for search, syllabus, plans and dashboard data."""
import re
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
