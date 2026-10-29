
from pathlib import Path
import pandas as pd

DATA_FILE = (
    Path(__file__).parent
    / "data"
    / "onet"
    / "skills_processed.csv"
)

df = pd.read_csv(DATA_FILE)

target_careers = [
    "Software Developers",
    "Web Developers",
    "Data Scientists",
    "Computer Programmers",
    "Database Administrators",
    "Software Quality Assurance Analysts and Testers",
]

for career in target_careers:
    career_df = df[df["Title"].str.casefold() == career.casefold()]

    print(f"\n{'=' * 65}")
    print(f"CAREER: {career}")

    if career_df.empty:
        print("Career not found.")
        continue

    print(
        career_df.sort_values("importance", ascending=False)[
            ["Element Name", "importance", "required_level"]
        ].to_string(index=False)
    )

print("\nDoes O*NET contain these exact technical skills?")
technical_skills = [
    "Python", "React", "JavaScript", "SQL", "Git",
    "Machine Learning", "HTML", "CSS",
]

available = set(df["Element Name"].dropna().str.casefold())

for skill in technical_skills:
    print(f"{skill}: {'YES' if skill.casefold() in available else 'NO'}")
