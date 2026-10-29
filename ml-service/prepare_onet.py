
from pathlib import Path
import pandas as pd

DATA_DIR = Path("data/onet")

files = [
    DATA_DIR / "essential_skills.csv",
    DATA_DIR / "skills.csv",
]

frames = []

for file_path in files:
    if not file_path.exists():
        raise FileNotFoundError(f"Missing dataset: {file_path}")

    df = pd.read_csv(file_path)
    print(f"{file_path.name}: {df.shape}")

    df = df[df["Scale ID"].isin(["IM", "LV"])].copy()
    df["Data Value"] = pd.to_numeric(
        df["Data Value"], errors="coerce"
    )
    frames.append(df)

df = pd.concat(frames, ignore_index=True)

skills = (
    df.pivot_table(
        index=[
            "O*NET-SOC Code",
            "Title",
            "Element ID",
            "Element Name",
        ],
        columns="Scale ID",
        values="Data Value",
        aggfunc="first",
    )
    .reset_index()
    .rename(columns={
        "IM": "importance",
        "LV": "required_level",
    })
)

skills = skills.dropna(
    subset=["importance", "required_level"],
    how="all",
)

skills = skills.drop_duplicates(
    subset=[
        "O*NET-SOC Code",
        "Element ID",
    ]
)

output_path = DATA_DIR / "skills_processed.csv"
skills.to_csv(output_path, index=False)

print("\nPrepared shape:", skills.shape)
print("Unique skill names:", skills["Element Name"].nunique())
print("Skill names:")
print(sorted(skills["Element Name"].unique()))
print("\nSaved:", output_path)
