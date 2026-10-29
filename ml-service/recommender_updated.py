
from pathlib import Path

import pandas as pd

from skill_analyzer import analyze_skill_gaps


DATA_FILE = (
    Path(__file__).parent
    / "data"
    / "onet"
    / "skills_processed.csv"
)


# Project-defined occupation skill profiles.
# These are matching rules, not official qualifications.
CAREER_PROFILES = {
    "accounting": {
        "terms": (
            "accountant",
            "accounting",
            "bookkeeping",
            "bookkeeper",
            "auditor",
            "tax preparer",
        ),
        "skills": {
            "Accounting", "Excel", "Financial Analysis", "Budgeting"
        },
    },
    "finance": {
        "terms": (
            "financial analyst",
            "financial examiner",
            "financial manager",
            "investment",
            "treasurer",
        ),
        "skills": {
            "Financial Analysis", "Excel", "Accounting",
            "Budgeting", "Economics",
        },
    },
    "market_research": {
        "terms": (
            "market research",
            "marketing specialist",
            "marketing manager",
        ),
        "skills": {
            "Marketing", "Business Analysis", "Excel",
            "Communication", "Data Analysis",
        },
    },
    "human_resources": {
        "terms": (
            "human resources",
            "hr specialist",
            "recruiter",
        ),
        "skills": {
            "Human Resources", "Communication", "Excel", "Writing"
        },
    },
    "business_analysis": {
        "terms": (
            "business analyst",
            "management analyst",
            "business operations",
        ),
        "skills": {
            "Business Analysis", "Excel", "Communication",
            "Critical Thinking", "Data Analysis",
        },
    },
    "technology_data": {
        "terms": (
            "penetration tester",
            "cybersecurity",
            "data scientist",
            "data analyst",
            "web developer",
            "programmer",
            "developer",
            "software",
            "database",
            "network",
        ),
        "skills": {
            "Python", "SQL", "Data Analysis", "Java",
            "JavaScript", "Machine Learning",
        },
    },
    "healthcare": {
        "terms": (
            "nurse",
            "physician",
            "clinical",
            "medical",
            "pharmacist",
            "dental",
            "patient care",
        ),
        "skills": {
            "Patient Care", "Clinical Assessment",
            "Medical Terminology", "First Aid",
        },
    },
    "law": {
        "terms": (
            "lawyer",
            "attorney",
            "paralegal",
            "judge",
            "judicial",
            "legal",
        ),
        "skills": {
            "Legal Research", "Legal Writing",
            "Policy Analysis", "Writing",
        },
    },
    "education": {
        "terms": (
            "teacher",
            "instructor",
            "school",
            "education",
            "curriculum",
            "training",
        ),
        "skills": {
            "Lesson Planning", "Curriculum Development",
            "Instructing", "Communication",
        },
    },
    "science_engineering": {
        "terms": (
            "engineer",
            "scientist",
            "chemist",
            "physicist",
            "biologist",
            "laboratory technician",
        ),
        "skills": {
            "Science", "Mathematics", "Engineering Design",
            "Quality Control",
        },
    },
}


# Explicit profiles for titles that were incorrectly classified
# by broad keyword matching. These are project-defined assumptions.
SPECIAL_PROFILES = {
    "software developer": {
        "terms": ("software developer",),
        "skills": {
            "Python", "Java", "JavaScript", "SQL", "Git",
            "Critical Thinking", "Programming",
        },
    },
    "web developer": {
        "terms": ("web developer",),
        "skills": {
            "JavaScript", "React", "HTML", "CSS", "Git", "SQL",
        },
    },
    "computer programmer": {
        "terms": ("computer programmer",),
        "skills": {
            "Python", "Java", "JavaScript", "SQL", "Programming", "Git",
        },
    },
    "data scientist": {
        "terms": ("data scientist",),
        "skills": {
            "Python", "SQL", "Machine Learning", "Data Analysis",
            "Statistics", "Data Visualization",
        },
    },
    "data analyst": {
        "terms": ("data analyst",),
        "skills": {
            "Python", "SQL", "Excel", "Data Analysis",
            "Statistics", "Data Visualization",
        },
    },
    "database architect": {
        "terms": ("database architect",),
        "skills": {
            "SQL", "Database Design", "Data Modeling",
            "Systems Analysis", "Critical Thinking",
        },
    },
    "database administrator": {
        "terms": ("database administrator",),
        "skills": {
            "SQL", "Python", "Data Analysis",
            "Critical Thinking", "Systems Analysis",
        },
    },
    "software quality assurance": {
        "terms": (
            "software quality assurance",
            "quality assurance analyst",
            "software tester",
        ),
        "skills": {
            "Testing", "Programming", "Quality Control Analysis",
            "Critical Thinking", "Troubleshooting", "Git",
        },
    },
    "penetration tester": {
        "terms": ("penetration tester", "penetration testing"),
        "skills": {
            "Networking", "Cybersecurity", "Python", "Linux",
            "Troubleshooting", "Critical Thinking",
        },
    },
    "computer numerically controlled tool programmer": {
        "terms": (
            "computer numerically controlled tool programmer",
            "cnc tool programmer",
        ),
        "skills": {
            "Programming", "Mathematics", "Engineering Design",
            "Quality Control Analysis", "Troubleshooting",
            "Technical Documentation",
        },
    },
    "computer network support specialist": {
        "terms": ("computer network support specialist",),
        "skills": {
            "Troubleshooting", "Active Listening", "Service Orientation",
            "Systems Analysis", "Critical Thinking",
        },
    },
    "computer network architect": {
        "terms": ("computer network architect",),
        "skills": {
            "Systems Analysis", "Systems Evaluation", "Technology Design",
            "Complex Problem Solving", "Critical Thinking",
        },
    },
    "network and computer systems administrator": {
        "terms": ("network and computer systems administrator",),
        "skills": {
            "Troubleshooting", "Systems Analysis", "Technology Design",
            "Critical Thinking", "Time Management",
        },
    },
    "energy auditor": {
        "terms": ("energy auditor",),
        "skills": {
            "Science", "Mathematics", "Quality Control Analysis",
            "Critical Thinking", "Technical Documentation",
        },
    },
    "clinical research coordinator": {
        "terms": ("clinical research coordinator",),
        "skills": {
            "Research", "Data Analysis", "Writing",
            "Critical Thinking", "Medical Terminology",
        },
    },
    "clinical data manager": {
        "terms": ("clinical data manager",),
        "skills": {
            "Data Analysis", "Statistics", "Excel",
            "Research", "Medical Terminology",
        },
    },
}


def load_career_data() -> pd.DataFrame:
    """Load and validate the processed O*NET dataset."""
    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Career dataset not found: {DATA_FILE}"
        )

    df = pd.read_csv(DATA_FILE)

    required = {
        "O*NET-SOC Code",
        "Title",
        "Element Name",
        "importance",
    }

    missing = required - set(df.columns)
    if missing:
        raise ValueError(
            f"Dataset is missing columns: {sorted(missing)}"
        )

    df["importance"] = pd.to_numeric(
        df["importance"], errors="coerce"
    )

    df = df.dropna(
        subset=[
            "O*NET-SOC Code",
            "Title",
            "Element Name",
            "importance",
        ]
    ).copy()

    df["Title"] = df["Title"].astype(str)
    df["Element Name"] = df["Element Name"].astype(str)

    return df


def get_career_profile(title: str) -> dict | None:
    """Return the most specific project-defined profile for an occupation title."""
    normalized = " ".join(str(title).casefold().split())

    # Specific profiles must be checked before broad domain profiles.
    # Sort by term length so a longer, more precise phrase wins if profiles overlap.
    specific_matches = []
    for profile in SPECIAL_PROFILES.values():
        for term in profile["terms"]:
            term_normalized = " ".join(term.casefold().split())
            if term_normalized in normalized:
                specific_matches.append((len(term_normalized), profile))

    if specific_matches:
        specific_matches.sort(key=lambda item: item[0], reverse=True)
        return specific_matches[0][1]

    # Broad profiles are a fallback for occupations without a dedicated profile.
    broad_matches = []
    for profile in CAREER_PROFILES.values():
        matched_terms = [
            term for term in profile["terms"]
            if " ".join(term.casefold().split()) in normalized
        ]
        if matched_terms:
            specificity = max(len(term) for term in matched_terms)
            broad_matches.append((specificity, profile))

    if not broad_matches:
        return None

    broad_matches.sort(key=lambda item: item[0], reverse=True)
    return broad_matches[0][1]


def recommend_careers(
    user_skills: list[str],
    top_n: int = 10,
) -> list[dict]:
    """
    Rank careers using O*NET skill importance and optional
    project-defined occupation profiles.
    """
    df = load_career_data()

    normalized_skills = {
        skill.strip().casefold()
        for skill in (user_skills or [])
        if isinstance(skill, str) and skill.strip()
    }

    results = []

    for (code, title), group in df.groupby(
        ["O*NET-SOC Code", "Title"],
        sort=False,
    ):
        group = group.drop_duplicates(
            subset=["Element Name"]
        ).copy()

        group["skill_key"] = (
            group["Element Name"].str.casefold()
        )

        matched_mask = group["skill_key"].isin(
            normalized_skills
        )

        total_importance = (
            group["importance"].clip(lower=0).sum()
        )

        matched_importance = (
            group.loc[matched_mask, "importance"]
            .clip(lower=0)
            .sum()
        )

        onet_score = (
            matched_importance / total_importance * 100
            if total_importance > 0
            else 0.0
        )

        onet_matched = group.loc[
            matched_mask, "Element Name"
        ].tolist()

        onet_missing = (
            group.loc[~matched_mask]
            .sort_values("importance", ascending=False)
            ["Element Name"]
            .tolist()
        )

        profile = get_career_profile(title)
        profile_skills = (
            profile["skills"] if profile else set()
        )

        profile_matched = sorted(
            (
                skill for skill in profile_skills
                if skill.casefold() in normalized_skills
            ),
            key=str.casefold,
        )

        profile_missing = sorted(
            (
                skill for skill in profile_skills
                if skill.casefold() not in normalized_skills
            ),
            key=str.casefold,
        )

        profile_score = (
            len(profile_matched) / len(profile_skills) * 100
            if profile_skills
            else None
        )

        # Retain the current weighting for comparability.
        # These scores are heuristics, not probabilities.
        
        # Transparent heuristic ranking.
        # O*NET contributes 80%; the project profile contributes 20%.
        # When O*NET has no direct match, use a conservative
        # profile-only fallback rather than treating profile
        # coverage as the full ranking score.
        
        # Transparent heuristic ranking — not an employment probability.
        if profile_score is not None and onet_score > 0:
            ranking_score = (
                0.80 * float(onet_score)
                + 0.20 * float(profile_score)
            )
            ranking_method = "onet_plus_profile"

        elif profile_score is not None:
            ranking_score = float(profile_score)
            ranking_method = "profile_only"

        else:
            ranking_score = float(onet_score)
            ranking_method = "onet_only"



        matched_skills = sorted(
            set(onet_matched + profile_matched),
            key=str.casefold,
        )

        # Recommend profile skills first, followed by important
        # O*NET skills. Remove duplicates case-insensitively.
        combined_skills = (
            profile_missing + onet_missing
            if profile
            else onet_missing
        )

        seen = set()
        recommended_skills = []

        for skill in combined_skills:
            key = skill.casefold()

            if key not in seen:
                seen.add(key)
                recommended_skills.append(skill)

            if len(recommended_skills) == 5:
                break

        onet_analysis = analyze_skill_gaps(
            user_skills or [],
            group["Element Name"].tolist(),
        )
        if profile_skills:
            coverage_analysis = analyze_skill_gaps(
                user_skills or [],
                sorted(profile_skills, key=str.casefold),
            )
        else:
            coverage_analysis = onet_analysis

        results.append({
            "profile_match_percent": (
                round(float(profile_score), 2)
                if profile_score is not None
                else None
            ),
            "onet_weighted_match_percent": float(round(onet_score, 2)),
            "profile_coverage_percent": (
                round(float(profile_score), 2)
                if profile_score is not None
                else None
            ),
            "ranking_method": ranking_method,
            
            "career": title,
            "occupation_code": code,
            "matched_skills": matched_skills,
            "occupation_profile_matched_skills": (
                profile_matched
            ),
            "missing_skills": onet_missing,
            "skill_coverage_percent": coverage_analysis["skill_coverage_percent"],
            "onet_skill_coverage_percent": onet_analysis["skill_coverage_percent"],
            "weighted_match_percent":float(round(onet_score, 2)),
            "occupation_profile_match_percent": (
                round(profile_score, 2)
                if profile_score is not None
                else None
            ),
            "ranking_score": round(
                ranking_score, 2
            ),
            "recommended_skills": recommended_skills,
            "score_explanation": (
                "Ranking combines O*NET importance-weighted "
                "skill matching with a project-defined occupation "
                "profile when available. Scores are heuristic, "
                "not hiring probabilities. Profiles are not "
                "official qualification checks."
            ),
        })

    results.sort(
        key=lambda item: (
            item["ranking_score"],
            item["occupation_profile_match_percent"] or 0,
            item["skill_coverage_percent"],
            len(item["matched_skills"]),
            item["weighted_match_percent"],
        ),
        reverse=True,
    )

    return results[:max(1, min(top_n, 50))]
