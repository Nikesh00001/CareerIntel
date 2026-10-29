
from pathlib import Path
import pandas as pd

data_dir = Path(__file__).parent / "data" / "onet"

for file in sorted(data_dir.glob("*.csv")):
    print(f"\n{'=' * 65}")
    print(f"FILE: {file.name}")

    try:
        df = pd.read_csv(file, low_memory=False)
        print("Shape:", df.shape)
        print("Columns:", df.columns.tolist())

        for col in ["Title", "Element Name", "skillLabel"]:
            if col in df.columns:
                print(f"Unique {col}:", df[col].nunique())

        if "Title" in df.columns:
            matches = df[
                df["Title"].astype(str).str.contains(
                    r"software|web developer|data scientist|database|programmer",
                    case=False,
                    na=False,
                    regex=True,
                )
            ]
            print("Relevant occupations:")
            print(matches["Title"].drop_duplicates().head(15).to_list())

    except Exception as exc:
        print("Could not inspect:", exc)
