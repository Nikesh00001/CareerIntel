
from pprint import pprint
from roadmap_generator import generate_roadmap

missing_skills = [
    "Python",
    "SQL",
    "Data Visualization",
    "Machine Learning",
]

roadmap = generate_roadmap(missing_skills)
pprint(roadmap)
