"""
StudyMate AI - Recommendation Engine

Scores every resource in the dataset against a student's learning profile
and returns the top matches, each with a human-readable explanation of
why it was recommended.

score = topic_match*35 + level_match*20 + goal_match*20
        + format_match*10 + difficulty_match*10 + time_match*5
(each *_match term is a 0..1 fraction, so the total is already 0..100)
"""

import json
import os
import re

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "resources.json")

WEIGHTS = {
    "topic": 35,
    "level": 20,
    "goal": 20,
    "format": 10,
    "difficulty": 10,
    "time": 5,
}

# Ordinal scales let us give "close" matches partial credit instead of
# scoring anything that isn't an exact match as zero.
KNOWLEDGE_ORDER = {"beginner": 0, "basics": 1, "intermediate": 2, "advanced": 3}
RESOURCE_LEVEL_ORDER = {"beginner": 0, "intermediate": 2, "advanced": 3, "all": 1.5}
DIFFICULTY_ORDER = {"easy": 0, "moderate": 1, "challenging": 2}

GOAL_LABELS = {
    "exam": "preparing for an exam",
    "concept": "understanding the concept",
    "practice": "practicing problems",
    "project": "building a project",
    "interview": "interview preparation",
    "explore": "exploring the topic",
}

KNOWLEDGE_LABELS = {
    "beginner": "a complete beginner",
    "basics": "someone who knows the basics",
    "intermediate": "at an intermediate level",
    "advanced": "an advanced learner",
}

FORMAT_LABELS = {
    "video": "video-based learning",
    "article": "reading articles",
    "interactive": "interactive practice",
    "practice": "practice problems",
    "notes": "quick notes",
}


def load_resources():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _normalize_text(value):
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()


def _topic_match(resource, profile):
    topic = _normalize_text(profile.get("topic", ""))
    subject = _normalize_text(profile.get("subject", ""))
    r_topic = _normalize_text(resource.get("topic", ""))
    r_subject = _normalize_text(resource.get("subject", ""))

    # When the student names a specific topic, that topic is what matters -
    # a resource from the same broad subject but a different topic (e.g.
    # "OOP" when asked about "Binary Search") should not count as a match.
    if topic:
        if topic == r_topic:
            return 1.0
        if topic in r_topic or r_topic in topic:
            return 0.85
        return 0.0

    if subject and subject == r_subject:
        return 0.5
    if subject and (subject in r_subject or r_subject in subject):
        return 0.4
    return 0.0


def _level_match(resource, profile):
    student_level = KNOWLEDGE_ORDER.get(profile.get("level", ""), None)
    resource_level = RESOURCE_LEVEL_ORDER.get(resource.get("knowledge_level", ""), None)
    if student_level is None or resource_level is None:
        return 0.5
    diff = abs(student_level - resource_level)
    return max(0.0, 1 - diff / 3)


def _goal_match(resource, profile):
    goal = profile.get("goal", "")
    resource_goals = resource.get("goals", [])
    if not goal:
        return 0.5
    return 1.0 if goal in resource_goals else 0.0


def _format_match(resource, profile):
    formats = profile.get("formats", []) or []
    if not formats:
        return 0.5
    return 1.0 if resource.get("format") in formats else 0.0


def _difficulty_match(resource, profile):
    student_diff = DIFFICULTY_ORDER.get(profile.get("difficulty", ""), None)
    resource_diff = DIFFICULTY_ORDER.get(resource.get("difficulty", ""), None)
    if student_diff is None or resource_diff is None:
        return 0.5
    diff = abs(student_diff - resource_diff)
    return max(0.0, 1 - diff / 2)


def _time_match(resource, profile):
    available = profile.get("time")
    estimated = resource.get("estimated_time")
    if not available or not estimated:
        return 0.5
    if estimated <= available:
        return 1.0
    overage = (estimated - available) / available
    return max(0.0, 1 - overage)


def _build_reason(resource, profile, sub_scores):
    parts = []
    knowledge_label = KNOWLEDGE_LABELS.get(profile.get("level", ""), "your current level")
    goal_label = GOAL_LABELS.get(profile.get("goal", ""), "your learning goal")
    formats = profile.get("formats", []) or []

    if sub_scores["topic"] >= 0.85:
        parts.append(f"a direct match for {profile.get('topic') or profile.get('subject')}")
    elif sub_scores["topic"] > 0:
        parts.append(f"closely related to {profile.get('subject')}")

    if sub_scores["level"] >= 0.9:
        parts.append(f"pitched right at {knowledge_label}")
    elif sub_scores["level"] >= 0.6:
        parts.append(f"a good stretch from {knowledge_label}")

    if sub_scores["goal"] >= 1.0:
        parts.append(f"built for {goal_label}")

    if sub_scores["format"] >= 1.0 and formats:
        format_label = FORMAT_LABELS.get(resource.get("format"), resource.get("format"))
        parts.append(f"matches your preference for {format_label}")

    if sub_scores["time"] >= 0.9 and profile.get("time"):
        parts.append(f"fits inside your {profile.get('time')}-minute study window")
    elif sub_scores["time"] < 0.5 and profile.get("time"):
        parts.append("runs a little long for your available time, but is worth the extra minutes")

    if not parts:
        return "The closest overall match to your learning profile among the available resources."

    sentence = f"You're {knowledge_label}, {goal_label}"
    extra = [p for p in parts if not p.startswith("a direct match") and not p.startswith("closely related")]
    if sub_scores["topic"] >= 0.85:
        sentence += f", so we prioritized a resource that matches {profile.get('topic') or profile.get('subject')} exactly"
    if extra:
        sentence += ". " + ("This resource " + " and ".join(extra) + ".").capitalize()
    else:
        sentence += "."
    return sentence


def recommend(profile, top_n=5):
    """
    profile: {
      "subject": str, "topic": str, "level": str (beginner/basics/intermediate/advanced),
      "goal": str, "formats": [str], "time": int (minutes), "difficulty": str
    }
    Returns a list of resource dicts augmented with match_score and reason,
    sorted by match_score descending.
    """
    resources = load_resources()
    scored = []

    for resource in resources:
        sub_scores = {
            "topic": _topic_match(resource, profile),
            "level": _level_match(resource, profile),
            "goal": _goal_match(resource, profile),
            "format": _format_match(resource, profile),
            "difficulty": _difficulty_match(resource, profile),
            "time": _time_match(resource, profile),
        }

        # A resource with zero topic relevance is not a real recommendation,
        # regardless of how well the other facets line up.
        if sub_scores["topic"] == 0.0:
            continue

        total = sum(sub_scores[key] * WEIGHTS[key] for key in WEIGHTS)
        total = round(min(100, max(0, total)))

        item = dict(resource)
        item["match_score"] = total
        item["reason"] = _build_reason(resource, profile, sub_scores)
        scored.append(item)

    scored.sort(key=lambda r: r["match_score"], reverse=True)

    if not scored:
        # No topic/subject match at all - fall back to the closest resources
        # by level/goal/format so the student is never shown a blank page.
        for resource in resources:
            sub_scores = {
                "topic": 0.2,
                "level": _level_match(resource, profile),
                "goal": _goal_match(resource, profile),
                "format": _format_match(resource, profile),
                "difficulty": _difficulty_match(resource, profile),
                "time": _time_match(resource, profile),
            }
            total = round(min(100, max(0, sum(sub_scores[key] * WEIGHTS[key] for key in WEIGHTS))))
            item = dict(resource)
            item["match_score"] = total
            item["reason"] = "We couldn't find an exact topic match, so this is the closest resource based on your learning profile."
            scored.append(item)
        scored.sort(key=lambda r: r["match_score"], reverse=True)

    return scored[:top_n]


def build_study_path(recommendations):
    """
    Orders the recommended resources into a short learning sequence:
    concept -> visual/interactive -> notes -> practice.
    """
    order = {"video": 0, "interactive": 1, "article": 1, "notes": 2, "practice": 3}
    path = sorted(recommendations, key=lambda r: order.get(r.get("format"), 4))
    step_labels = [
        "Understand the concept",
        "Reinforce with a visual or interactive walkthrough",
        "Skim notes for quick revision",
        "Practice problems to lock it in",
    ]
    steps = []
    for i, resource in enumerate(path):
        label = step_labels[i] if i < len(step_labels) else "Go deeper"
        steps.append({
            "step": i + 1,
            "label": label,
            "resource_id": resource["id"],
            "title": resource["title"],
        })
    return steps
