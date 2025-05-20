"use server";

import { Class, Homework } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const getClassesStudent = async () => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return [];
        }

        const userId = user.id;

        const { data, error } = await supabase
            .from("student_class")
            .select(`
                classes:class_id (*)
            `)
            .eq("student_id", userId);

        if (error) {
            throw error;
        }

        const classes = data.map((item) => item.classes);

        return classes;
    } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
    }
}

export const getClassesTeacher = async () => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return [];
        }

        const userId = user.id;

        const { data: classes, error } = await supabase
            .from("classes")
            .select("*")
            .eq("teacher_id", userId);

        if (error) {
            throw error;
        }

        return classes;
    } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
    }
}

export const getClassDetailsStudent = async (classId: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;

        const { data, error } = await supabase
            .from("student_class")
            .select(`
                classes:class_id (*)
            `)
            .eq("student_id", userId)
            .eq("class_id", classId)
            .single();

        if (error) {
            throw error;
        }

        return data?.classes as unknown as Class;
    } catch (error) {
        console.error("Error fetching class:", error);
        redirect("/unauthorized");
    }
}

export const getClassDetailsTeacher = async (classId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("classes")
            .select("*")
            .eq("id", classId)
            .single();

        if (error) {
            throw error;
        }

        return data as Class;
    } catch (error) {
        console.error("Error fetching class:", error);
        return null;
    }
}

export const getHomeworkForClass = async (classId: string) => {
    try {
        const supabase = await createClient();
        const { data: homework, error } = await supabase
            .from("homework")
            .select("*")
            .eq("class_id", classId);

        if (error) {
            throw error;
        }
        return homework;
    } catch (error) {
        console.error("Error fetching homework:", error);
        return [];
    }
}

export const getHomeworkDetails = async (homeworkId: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;

        const { data: homework, error } = await supabase
            .from("homework")
            .select("*")
            .eq("id", homeworkId)
            .single();

        if (error) {
            throw error;
        }

        const classId = homework.class_id;

        const { data: enrolled, error: enrollError } = await supabase
            .from("student_class")
            .select("id")
            .eq("student_id", userId)
            .eq("class_id", classId)
            .single();

        if (enrollError || !enrolled) {
            throw enrollError;
        }
        return homework;
    } catch (error) {
        console.error("Error fetching homework details:", error);
        redirect("/unauthorized");
    }
}

export const createHomework = async (homeworkData: Homework) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("homework")
            .insert([homeworkData])
            .select();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error creating homework:", error);
        return null;
    }
}

export const createClass = async (classData: Class) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;
        classData.teacher_id = userId;

        const { data, error } = await supabase
            .from("classes")
            .insert([classData])
            .select();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error creating class:", error);
        return null;
    }
}

export const addStudentToClass = async (classId: string | undefined, studentEmail: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_user_id_by_email", { email: studentEmail });

        if (error || !data || data.length === 0) {
            console.error("Student not found");
            return null;
        }

        const studentId = data[0].id;

        console.log("Student ID:", studentId);

        const { data: student, error: studentError } = await supabase
            .from("user_roles")
            .select("id")
            .eq("user_id", studentId)
            .eq("role", "student")
            .single();
        
        if (studentError || !student) {
            console.error("User is not a student");
            return null;
        }

        const { data: id, error: insertError } = await supabase
            .from("student_class")
            .upsert({
                student_id: studentId,
                class_id: classId
            })
            .select();


        if (insertError) {
            throw insertError;
        }
        return id;
    } catch (error) {
        console.error("Error adding student to class:", error);
        return null;
    }
}

export const getStudentsInClass = async (classId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("students_in_class")
            .select("email")
            .eq("class_id", classId);

        if (error) {
            throw error;
        }

        const students = data.map((item) => item.email);
        return students;
    }
    catch (error) {
        console.error("Error fetching students in class:", error);
        return [];
    }
}

export const uploadFile = async (file: File, title: string) => {
    try {
        const supabase = await createClient();
        const ext = file.name.split(".").pop();

        const { data, error } = await supabase.storage
            .from("homework")
            .upload(`${title}.${ext}`, file, { upsert: true });

        if (error) {
            throw error;
        }
        return {
            success: true,
            url: supabase.storage.from("homework").getPublicUrl(data?.path).data.publicUrl
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            url: undefined
        }
    }
}