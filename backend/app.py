from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# CLASS
class Student:   #mapped to database table
    def __init__(self, id, name, course=None):
        self.id = id
        self.name = name
        self.course = course

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "course": self.course
        }

# data holder
students = [
    Student(1, "Akida Mwaura", "Software Development"),
    Student(2, "Mike John", "Cyber Security")
]

# CREATE
@app.route('/students', methods=["POST"])
def create_student():
    data = request.json
    new_student = Student(id=data["id"], name=data["name"], course=data["course"])
    students.append(new_student)
    return jsonify(new_student.to_dict()), 201

# GET ALL
@app.route('/students', methods=["GET"])
def fetch_students():
    return jsonify([student.to_dict() for student in students])

# GET ONE
@app.route('/students/<int:id>', methods=["GET"])
def fetch_student(id):
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(student.to_dict())

# UPDATE
@app.route('/students/<int:id>', methods=["PATCH"])
def update_student(id):
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    data = request.json
    if "name" in data:
        student.name = data["name"]
    if "course" in data:
        student.course = data["course"]
    return jsonify(student.to_dict())

# DELETE
@app.route('/students/<int:id>', methods=["DELETE"])
def delete_student(id):
    global students
    student = next((s for s in students if s.id == id), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    students = [s for s in students if s.id != id]
    return jsonify({"message": "Student deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)