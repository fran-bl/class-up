"use server";

import { Challenge, Class, Homework } from "@/types/types";
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

export const getHomeworksForStudent = async (studentId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("homework_submission")
            .select(`
                *,
                homework:homework_id (title)
            `)
            .eq("student_id", studentId)
            .eq("graded", true)

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching homeworks for student:", error);
        return [];
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

export const deleteStudentFromClass = async (classId: string | undefined, studentId: string) => {
    try {
        const supabase = await createClient();
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
            .select("username, id")
            .eq("class_id", classId);

        if (error) {
            throw error;
        }

        const students = data.map((item) => {
            return {
                username: item.username,
                id: item.id
            };
        });
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

export const gradeHomework = async (homeworkId: string, studentId: string, grade: number) => {
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

        addXpToUserById(studentId, grade);

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

export const updateXpGainChallenges = async (classId: string, xp: number) => {
    try {
        const supabase = await createClient();
        const { data: activeChallenges, error: challengesError } = await supabase
            .rpc("get_active_xp_challenges", { class_id: classId });

        if (challengesError) {
            console.error("Error fetching challenges:", challengesError);
            return false;
        }

        if (!activeChallenges || activeChallenges.length === 0) {
            console.warn("No active challenges found for class:", classId);
            return false;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return false;
        }

        for (const challenge of activeChallenges) {
            const newProgress = (challenge.progress || 0) + xp;
            const { error: updateError } = await supabase
                .from("challenges")
                .update({ progress: newProgress })
                .eq("id", challenge.id)

            if (updateError) {
                console.error(`Error updating progress for challenge ${challenge.id}:`, updateError);
            }

            const { data: participant, error: participantError } = await supabase
                .from("challenge_participants")
                .select("*")
                .eq("challenge_id", challenge.id)
                .eq("profile_id", user.id)
                .maybeSingle()

            if (participantError) {
                console.error(`Error fetching participant for challenge ${challenge.id}:`, participantError);
                continue;
            }

            if (participant) {
                const newXp = (participant.contribution || 0) + xp;
                const { error: updateParticipantError } = await supabase
                    .from("challenge_participants")
                    .update({ contribution: newXp })
                    .eq("challenge_id", challenge.id)
                    .eq("profile_id", user.id)

                if (updateParticipantError) {
                    console.error(`Error updating participant XP for challenge ${challenge.id}:`, updateParticipantError);
                }
            } else {
                const { error: insertParticipantError } = await supabase
                    .from("challenge_participants")
                    .insert({
                        challenge_id: challenge.id,
                        profile_id: user.id,
                        contribution: xp
                    });

                if (insertParticipantError) {
                    console.error(`Error inserting participant for challenge ${challenge.id}:`, insertParticipantError);
                }
            }
        }
        
        return true;
    } catch (error) {
        console.error("Error updating XP gain challenges:", error);
        return false;
    }
}

export const getChallenges = async () => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return [];
        }

        const { data: classes, error: classesError } = await supabase
            .from("student_class")
            .select("class_id")
            .eq("student_id", user.id);
        
        if (classesError) {
            console.error("Error fetching classes:", classesError);
            return [];
        }

        const classIds = classes.map(item => item.class_id);

        const now = new Date().toISOString();
        const { data: challenges, error: challengesError } = await supabase
            .from("challenges_expanded")
            .select("*")
            .in("target_class", classIds)
            .gt("end_date", now)

        if (challengesError) {
            console.error("Error fetching challenges:", challengesError);
            return [];
        }
        return challenges;
    } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
    }
}

export const getChallengeById = async (challengeId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("challenges")
            .select("*")
            .eq("id", challengeId)
            .single();

        if (error) {
            console.error("Error fetching challenge:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching challenge:", error);
        return null;
    }
}

export const getParticipants = async (challengeId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("challenge_participants")
            .select(`
                *,
                profile:profile_id (*)
            `)
            .eq("challenge_id", challengeId);

        if (error) {
            console.error("Error fetching participants:", error);
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        return [];
    }
}

export const getUserProfileById = async (userId: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export const createChallenge = async (challengeData: Challenge) => {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Error fetching user:", userError);
            return null;
        }

        const userId = user.id;
        challengeData.created_by = userId;

        const { data, error } = await supabase
            .from("challenges")
            .insert([challengeData])
            .select();

        if (error) {
            console.error("Error creating challenge:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error creating challenge:", error);
        return null;
    }
}