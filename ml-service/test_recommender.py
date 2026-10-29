
from recommender import recommend_careers

tests = {
    "TECHNICAL RESUME": [
        "Python", "SQL", "JavaScript", "React",
        "Git", "Data Analysis", "Machine Learning"
    ],
    "O*NET OCCUPATIONAL SKILLS": [
        "Programming", "Systems Analysis", "Critical Thinking",
        "Complex Problem Solving", "Mathematics",
        "Active Learning", "Writing"
    ],
    "BUSINESS RESUME": [
        "Accounting", "Excel", "Communication",
        "Financial Analysis", "Budgeting", "Critical Thinking"
    ],
}

for name, skills in tests.items():
    print(f"\n{'=' * 15} {name} {'=' * 15}")

    results = recommend_careers(skills, top_n=5)

    for career in results:
        print(
            career["career"],
            "| Ranking:", career["ranking_score"],
            "| O*NET:", career["weighted_match_percent"],
            "| Profile:", career.get(
                "occupation_profile_match_percent", "N/A"
            ),
        )
