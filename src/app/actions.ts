"use server";

import { Class, Homework } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { format, toZonedTime } from "date-fns-tz";
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

export const deleteStudentFromClass = async (classId: string | undefined, username: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("student_class_profile")
            .select("id")
            .eq("username", username)
            .eq("class_id", classId)
            .single();

        if (error || !data) {
            console.error("Student not found");
            return null;
        }

        const studentId = data.id;

        const { data: id, error: deleteError } = await supabase
            .from("student_class")
            .delete()
            .eq("student_id", studentId)
            .eq("class_id", classId)
            .select();

        if (deleteError) {
            throw deleteError;
        }
        return id;
    } catch (error) {
        console.error("Error deleting student from class:", error);
        return null;
    }
}

export const getStudentsInClass = async (classId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("student_class_profile")
            .select("username")
            .eq("class_id", classId);

        if (error) {
            throw error;
        }

        const students = data.map((item) => item.username);
        return students;
    }
    catch (error) {
        console.error("Error fetching students in class:", error);
        return [];
    }
}

export const makeSubmission = async (homeworkId: string, classId: string, fileUrl: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;

        const { data, error } = await supabase
            .from("homework_submission")
            .upsert({
                homework_id: homeworkId,
                student_id: userId,
                file_url: fileUrl,
                class_id: classId,
                submitted_at: new Date().toISOString()
            }, { onConflict: "homework_id,student_id" })
            .select();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error making submission:", error);
        return null;
    }
}

export const getSubmission = async (homeworkId: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;

        const { data, error } = await supabase
            .from("homework_submission")
            .select("*")
            .eq("homework_id", homeworkId)
            .eq("student_id", userId)
            .maybeSingle();

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching submission:", error);
        return null;
    }
}

export const gradeHomework = async (homeworkId: string, studentId: string, grade: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("homework_submission")
            .update({ graded: true, grade, graded_at: new Date().toISOString() })
            .eq("homework_id", homeworkId)
            .eq("student_id", studentId)
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error grading homework:", error);
        return null;
    }
}

export const getSubmissionsForHomework = async (homeworkId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("homework_submissions_expanded")
            .select("*")
            .eq("homework_id", homeworkId);

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
}

export const uploadHomeworkFile = async (file: File, title: string) => {
    try {
        const supabase = await createClient();
        const ext = file.name.split(".").pop();

        const { data, error } = await supabase.storage
            .from("homework")
            .upload(`/homework/${title}.${ext}`, file, { upsert: true });

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

export const uploadSubmissionFile = async (file: File, hwId: string) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return {
                success: false,
                url: undefined
            }
        }

        const userId = user.id;
        const ext = file.name.split(".").pop();

        const { data, error } = await supabase.storage
            .from("homework")
            .upload(`/submission/${hwId}/${userId}.${ext}`, file, { upsert: true });

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

export const addXpToUser = async (xp: number) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;

        const { data: profileData, error: fetchError } = await supabase
            .from("profiles")
            .select("xp")
            .eq("id", userId)
            .single();

        if (fetchError || !profileData) {
            console.error("Error fetching profile data:", fetchError);
            return null;
        }

        const currentXP = profileData.xp || 0;
        const newXP = currentXP + xp;

        const { data: updatedData, error: updateError } = await supabase
            .from("profiles")
            .update({ xp: newXP })
            .eq("id", userId)
            .select();

        if (updateError) {
            throw updateError;
        }

        return updatedData;
    } catch (error) {
        console.error("Error adding XP to user:", error);
        return null;
    }
};

export const addXpToUserById = async (userId: string, xp: number) => {
    try {
        const supabase = await createClient();
        const { data: profileData, error: fetchError } = await supabase
            .from("profiles")
            .select("xp")
            .eq("id", userId)
            .single();

        if (fetchError || !profileData) {
            console.error("Error fetching profile data:", fetchError);
            return null;
        }

        const currentXP = profileData.xp || 0;
        const newXP = currentXP + xp;

        const { data: updatedData, error: updateError } = await supabase
            .from("profiles")
            .update({ xp: newXP })
            .eq("id", userId)
            .select();
            
        if (updateError) {
            throw updateError;
        }
        return updatedData;
    } catch (error) {
        console.error("Error adding XP to user:", error);
        return null;
    }
}

export const getFormattedDate = async (dateString: string) => {
    const date = new Date(dateString);
    const timeZone = 'Europe/Berlin';

    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, "dd.MM.yyyy'. at 'HH:mm", { timeZone });
}