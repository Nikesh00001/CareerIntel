
from urllib.parse import quote


# Project-defined learning resources.
# Verify individual courses before presenting them as endorsements.
LEARNING_RESOURCES = {
    "Python": {
        "description": "Learn Python syntax, functions, collections, and modules.",
        "hours": 12,
        "level": "Beginner",
        "url": "https://docs.python.org/3/tutorial/",
        "task": "Build a command-line student grade calculator.",
    },
    "SQL": {
        "description": "Learn queries, filtering, joins, grouping, and subqueries.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://sqlbolt.com/",
        "task": "Write queries to analyze a sample student database.",
    },
    "Excel": {
        "description": "Practice formulas, sorting, filtering, and pivot tables.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://support.microsoft.com/excel",
        "task": "Create a spreadsheet report with charts and summaries.",
    },
    "Pandas": {
        "description": "Clean, transform, and analyze tabular data with Python.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://pandas.pydata.org/docs/getting_started/",
        "task": "Clean a CSV dataset and summarize missing values.",
    },
    "NumPy": {
        "description": "Practice arrays, vectorized calculations, and statistics.",
        "hours": 6,
        "level": "Intermediate",
        "url": "https://numpy.org/learn/",
        "task": "Calculate summary statistics from a numeric dataset.",
    },
    "Statistics": {
        "description": "Study descriptive statistics, distributions, and sampling.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://www.khanacademy.org/math/statistics-probability",
        "task": "Analyze the distribution and average of a dataset.",
    },
    "Machine Learning": {
        "description": "Learn supervised learning, model evaluation, and overfitting.",
        "hours": 15,
        "level": "Intermediate",
        "url": "https://scikit-learn.org/stable/user_guide.html",
        "task": "Train and evaluate a classification or regression model.",
    },
    "Scikit-learn": {
        "description": "Build preprocessing and machine-learning pipelines.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://scikit-learn.org/stable/getting_started.html",
        "task": "Compare two models using a held-out test set.",
    },
    "Data Analysis": {
        "description": "Practice asking questions, cleaning data, and interpreting results.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://www.kaggle.com/learn",
        "task": "Write a short report supported by data and charts.",
    },
    "Data Visualization": {
        "description": "Learn to select charts and communicate patterns clearly.",
        "hours": 6,
        "level": "Beginner",
        "url": "https://matplotlib.org/stable/tutorials/",
        "task": "Create three clear charts from one dataset.",
    },
    "Java": {
        "description": "Learn object-oriented programming, collections, and exceptions.",
        "hours": 12,
        "level": "Beginner",
        "url": "https://dev.java/learn/",
        "task": "Build a simple library management program.",
    },
    "JavaScript": {
        "description": "Learn variables, functions, arrays, objects, and async code.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "task": "Build an interactive task list.",
    },
    "HTML": {
        "description": "Structure accessible web pages with semantic HTML.",
        "hours": 4,
        "level": "Beginner",
        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        "task": "Create a semantic portfolio page.",
    },
    "CSS": {
        "description": "Learn layout, responsive design, and visual styling.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
        "task": "Make the portfolio responsive on mobile and desktop.",
    },
    "React": {
        "description": "Learn components, props, state, and effects.",
        "hours": 12,
        "level": "Intermediate",
        "url": "https://react.dev/learn",
        "task": "Build a dashboard with reusable components.",
    },
    "Node.js": {
        "description": "Build server-side JavaScript applications.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://nodejs.org/en/learn",
        "task": "Create a small HTTP API.",
    },
    "Express.js": {
        "description": "Create routes, middleware, and REST endpoints.",
        "hours": 6,
        "level": "Intermediate",
        "url": "https://expressjs.com/en/starter/hello-world.html",
        "task": "Build CRUD endpoints for a notes application.",
    },
    "MongoDB": {
        "description": "Learn documents, queries, indexes, and data modeling.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://www.mongodb.com/docs/manual/",
        "task": "Design collections for a small application.",
    },
    "Git": {
        "description": "Practice commits, branches, merges, and collaboration.",
        "hours": 4,
        "level": "Beginner",
        "url": "https://git-scm.com/book/en/v2",
        "task": "Version-control a project and create a feature branch.",
    },
    "FastAPI": {
        "description": "Build validated Python API endpoints and documentation.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "task": "Build an API endpoint with request validation.",
    },
    "Critical Thinking": {
        "description": "Practice evaluating evidence and comparing solutions.",
        "hours": 5,
        "level": "Beginner",
        "url": "https://www.khanacademy.org/",
        "task": "Document two approaches to a problem and justify your choice.",
    },
    "Complex Problem Solving": {
        "description": "Break complex problems into testable subproblems.",
        "hours": 6,
        "level": "Beginner",
        "url": "https://www.khanacademy.org/",
        "task": "Solve a multi-step problem and explain your reasoning.",
    },
    "Programming": {
        "description": "Practice algorithms, control flow, functions, and debugging.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://www.freecodecamp.org/learn/",
        "task": "Solve five programming exercises and test edge cases.",
    },
    "Systems Analysis": {
        "description": "Identify system requirements, components, and dependencies.",
        "hours": 6,
        "level": "Intermediate",
        "url": "https://www.atlassian.com/agile/product-management/requirements",
        "task": "Create a requirements document and a simple system diagram.",
    },
    "Troubleshooting": {
        "description": "Use logs, reproduction steps, and tests to isolate faults.",
        "hours": 5,
        "level": "Beginner",
        "url": "https://developer.mozilla.org/",
        "task": "Debug a deliberately broken program and record the root cause.",
    },
    "Writing": {
        "description": "Practice clear, structured technical and professional writing.",
        "hours": 4,
        "level": "Beginner",
        "url": "https://owl.purdue.edu/",
        "task": "Write a one-page project summary with clear headings.",
    },
    "Communication": {
        "description": "Practice explaining ideas clearly to different audiences.",
        "hours": 4,
        "level": "Beginner",
        "url": "https://owl.purdue.edu/",
        "task": "Give a short explanation of a project to a nontechnical audience.",
    },
    "Accounting": {
        "description": "Learn basic financial statements and accounting principles.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://www.accountingcoach.com/",
        "task": "Prepare a basic income statement from sample transactions.",
    },
    "Financial Analysis": {
        "description": "Practice interpreting financial statements and ratios.",
        "hours": 8,
        "level": "Intermediate",
        "url": "https://www.accountingcoach.com/",
        "task": "Compare two sample companies using financial ratios.",
    },
    "Budgeting": {
        "description": "Learn to estimate costs and compare planned versus actual spending.",
        "hours": 5,
        "level": "Beginner",
        "url": "https://www.consumerfinance.gov/consumer-tools/",
        "task": "Create a monthly budget with variance calculations.",
    },
    "Marketing": {
        "description": "Study audience research, positioning, and campaign measurement.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://academy.hubspot.com/",
        "task": "Draft a simple campaign plan with measurable objectives.",
    },
    "Human Resources": {
        "description": "Learn recruitment, onboarding, and employee record basics.",
        "hours": 6,
        "level": "Beginner",
        "url": "https://www.shrm.org/",
        "task": "Draft a structured onboarding checklist.",
    },
    "Patient Care": {
        "description": "Study foundational patient safety and care principles.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://www.who.int/health-topics/patient-safety",
        "task": "Summarize patient-safety principles using reputable learning materials.",
    },
    "Medical Terminology": {
        "description": "Learn common medical prefixes, roots, and suffixes.",
        "hours": 8,
        "level": "Beginner",
        "url": "https://medlineplus.gov/",
        "task": "Create a glossary of 30 medical terms.",
    },
    "Legal Research": {
        "description": "Practice finding, assessing, and summarizing legal sources.",
        "hours": 6,
        "level": "Beginner",
        "url": "https://www.law.cornell.edu/",
        "task": "Summarize a legal topic using primary sources where available.",
    },
    "Lesson Planning": {
        "description": "Define learning objectives, activities, and assessment methods.",
        "hours": 5,
        "level": "Beginner",
        "url": "https://www.unesco.org/en/education",
        "task": "Create a lesson plan with objectives and an assessment.",
    },
    "Mathematics": {
        "description": "Review algebra, functions, and quantitative reasoning.",
        "hours": 10,
        "level": "Beginner",
        "url": "https://www.khanacademy.org/math",
        "task": "Solve practice problems and record incorrect answers.",
    },
    "Science": {
        "description": "Practice scientific reasoning and evidence-based explanations.",
        "hours": 6,
        "level": "Beginner",
        "url": "https://www.khanacademy.org/science",
        "task": "Write a short explanation supported by scientific evidence.",
    },
}


def _normalize_skill(skill):
    return " ".join(str(skill).strip().split())


def _resource_for(skill):
    """Use a known resource or a safe search fallback."""
    resource = LEARNING_RESOURCES.get(skill)

    if resource:
        return resource

    return {
        "description": f"Learn the foundations of {skill} and practice with a small project.",
        "hours": 5,
        "level": "Beginner",
        "url": "https://www.google.com/search?q=" + quote(
            skill + " beginner tutorial"
        ),
        "task": f"Complete a beginner exercise related to {skill}.",
    }


def generate_roadmap(missing_skills):
    """
    Build an ordered learning roadmap from a list of missing skills.

    Compatible with existing calls: generate_roadmap(missing_skills).
    The durations are planning estimates, not guaranteed learning times.
    """
    skills = []
    seen = set()

    for item in missing_skills or []:
        if not isinstance(item, str) or not item.strip():
            continue

        skill = _normalize_skill(item)
        key = skill.casefold()

        if key not in seen:
            seen.add(key)
            skills.append(skill)

    roadmap = []

    for index, skill in enumerate(skills, start=1):
        resource = _resource_for(skill)

        roadmap.append({
            "step": index,
            "skill": skill,
            "priority": "High" if index <= 3 else "Medium",
            "level": resource["level"],
            "estimated_hours": resource["hours"],
            "description": resource["description"],
            "resource_url": resource["url"],
            "practical_task": resource["task"],
            "status": "not_started",
        })

    return {
        "title": "Personalized Learning Roadmap",
        "total_skills": len(roadmap),
        "estimated_total_hours": sum(
            step["estimated_hours"] for step in roadmap
        ),
        "completed_skills": 0,
        "steps": roadmap,
        "note": (
            "Priorities and durations are planning estimates. "
            "Review the resources and adapt the plan to the learner."
        ),
    }
