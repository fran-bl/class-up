"use server";

import { Homework } from "@/types/types";
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

export const createHomework = async (homeworkData: Homework) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("homework")
            .insert([homeworkData]);

        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error creating homework:", error);
        return null;
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