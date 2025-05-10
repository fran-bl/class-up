"use server";

import { createClient } from "@/utils/supabase/server";

export const getClasses = async () => {
    try {
        const supabase = await createClient();
        const { data: classes, error } = await supabase
            .from("classes")
            .select("*");

        if (error) {
            throw error;
        }
        return classes;
    } catch (error) {
        console.error("Error fetching classes:", error);
        return [];
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
        const { data: homework, error } = await supabase
            .from("homework")
            .select("*")
            .eq("id", homeworkId)
            .single();

        if (error) {
            throw error;
        }
        return homework;
    } catch (error) {
        console.error("Error fetching homework details:", error);
        return null;
    }
}