
import re


# Canonical skill names and common variations.
SKILL_ALIASES = {
    # Programming and IT
    "Python": ["python"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js"],
    "C++": ["c++", "cpp"],
    "SQL": ["sql", "mysql", "postgresql", "sqlite"],
    "MongoDB": ["mongodb", "mongo db"],
    "React": ["react", "react.js", "reactjs"],
    "Node.js": ["node.js", "nodejs"],
    "Express.js": ["express.js", "expressjs"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Git": ["git", "github"],
    "Docker": ["docker"],
    "FastAPI": ["fastapi"],
    "Django": ["django"],
    "Flask": ["flask"],

    # Data science
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Scikit-learn": ["scikit-learn", "sklearn"],
    "Machine Learning": ["machine learning"],
    "Data Analysis": ["data analysis", "data analytics"],
    "Data Visualization": [
        "data visualization",
        "data visualisation",
    ],
    "Statistics": ["statistics", "statistical analysis"],
    "Excel": ["excel", "microsoft excel"],
    "Artificial Intelligence": ["artificial intelligence"],

    # General workplace and O*NET skills
    "Reading Comprehension": ["reading comprehension"],
    "Active Listening": ["active listening"],
    "Writing": ["writing", "written communication"],
    "Speaking": ["public speaking", "verbal communication"],
    "Critical Thinking": ["critical thinking"],
    "Active Learning": ["active learning"],
    "Learning Strategies": ["learning strategies"],
    "Monitoring": ["monitoring"],
    "Mathematics": ["mathematics", "mathematical"],
    "Science": ["science"],
    "Complex Problem Solving": ["complex problem solving"],
    "Judgment and Decision Making": [
        "judgment and decision making",
        "decision making",
    ],
    "Time Management": ["time management"],
    "Coordination": ["coordination"],
    "Social Perceptiveness": ["social perceptiveness"],
    "Persuasion": ["persuasion"],
    "Negotiation": ["negotiation"],
    "Instructing": ["instructing", "teaching"],
    "Service Orientation": ["service orientation"],
    "Systems Analysis": ["systems analysis"],
    "Systems Evaluation": ["systems evaluation"],
    "Teamwork": ["teamwork", "team work"],
    "Communication": ["communication"],
    "Leadership": ["leadership"],
    "Research": ["research"],
    "Customer Service": ["customer service"],
    "Project Management": ["project management"],

    # Business and finance
    "Accounting": ["accounting"],
    "Financial Analysis": ["financial analysis"],
    "Budgeting": ["budgeting"],
    "Marketing": ["marketing"],
    "Sales": ["sales"],
    "Business Analysis": ["business analysis"],
    "Economics": ["economics"],
    "Human Resources": ["human resources", "hr"],

    # Healthcare
    "Patient Care": ["patient care"],
    "Clinical Assessment": ["clinical assessment"],
    "Medical Terminology": ["medical terminology"],
    "First Aid": ["first aid"],
    "Public Health": ["public health"],

    # Law and public administration
    "Legal Research": ["legal research"],
    "Legal Writing": ["legal writing"],
    "Policy Analysis": ["policy analysis"],
    "Public Administration": ["public administration"],

    # Education and social sciences
    "Curriculum Development": ["curriculum development"],
    "Lesson Planning": ["lesson planning"],
    "Counseling": ["counseling", "counselling"],
    "Psychology": ["psychology"],
    "Sociology": ["sociology"],

    # Science and engineering
    "Engineering Design": ["engineering design"],
    "Quality Control": ["quality control"],
    "Technical Documentation": ["technical documentation"],
    "Laboratory Techniques": ["laboratory techniques"],
}


def contains_term(text: str, term: str) -> bool:
    """Match a term without matching it inside unrelated words."""
    pattern = r"(?<!\w)" + re.escape(term) + r"(?!\w)"
    return re.search(pattern, text, flags=re.IGNORECASE) is not None


def extract_skills(text: str) -> list[str]:
    """Return canonical skills identified in text."""
    found_skills = []

    for canonical_name, aliases in SKILL_ALIASES.items():
        if any(contains_term(text, alias) for alias in aliases):
            found_skills.append(canonical_name)

    return sorted(found_skills)


def analyze_skill_gaps(
    user_skills: list[str],
    required_skills: list[str],
) -> dict:
    """Compare extracted skills with a career's required skills."""
    user_set = {
        skill.strip().casefold()
        for skill in user_skills
        if isinstance(skill, str) and skill.strip()
    }
    required_set = list(dict.fromkeys(required_skills))

    matched = [
        skill for skill in required_set
        if skill.casefold() in user_set
    ]
    missing = [
        skill for skill in required_set
        if skill.casefold() not in user_set
    ]

    coverage = (
        round(len(matched) / len(required_set) * 100, 2)
        if required_set else 0.0
    )

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "skill_coverage_percent": coverage,
    }
