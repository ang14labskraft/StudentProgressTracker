/**
 * Interface representing a student in the Student Progress Tracker system.
 * Contains academic and personal information of a student.
 */
export interface Student {
    /** Unique identifier for the student */
    id: string;
    /** Full name of the student */
    name: string;
    /** Current class/grade level of the student */
    class: number;
    /** Section/division of the student's class */
    section: string;
    /** Mathematics score (0-100) */
    math: number;
    /** Science score (0-100) */
    science: number;
    /** English score (0-100) */
    english: number;
    /** Total score (sum of math, science, and english) */
    total: number;
    /** Overall grade based on total score */
    grade: string;
}