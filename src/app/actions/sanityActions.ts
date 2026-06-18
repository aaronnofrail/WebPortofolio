"use server";

import { createClient } from "@sanity/client";
import { revalidatePath } from "next/cache";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "y2wq5bs3",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-06-13",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const hasWriteToken = () => {
  return !!process.env.SANITY_API_WRITE_TOKEN;
};

// --- BIO ACTIONS ---
export async function saveBioAction(bio: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    // Check if bio document exists
    const existing = await writeClient.fetch(`*[_type == "bio"][0]`);
    if (existing) {
      await writeClient
        .patch(existing._id)
        .set({
          name: bio.name,
          role: bio.role,
          terminalText: bio.terminalText,
          description: bio.description,
          philosophy: bio.philosophy,
          skills: bio.skills,
        })
        .commit();
    } else {
      await writeClient.create({
        _type: "bio",
        name: bio.name,
        role: bio.role,
        terminalText: bio.terminalText,
        description: bio.description,
        philosophy: bio.philosophy,
        skills: bio.skills,
      });
    }
    revalidatePath("/");
    revalidatePath("/home");
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    console.error("saveBioAction error:", error);
    return { success: false, error: error.message };
  }
}

// --- EXPERIENCE ACTIONS ---
export async function createExperienceAction(exp: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.create({
      _type: "experience",
      jobTitle: exp.jobTitle,
      company: exp.company,
      period: exp.period,
      status: exp.status,
      responsibilities: exp.responsibilities,
      tags: exp.tags,
    });
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExperienceAction(id: string, exp: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.createOrReplace({
      _id: id,
      _type: "experience",
      jobTitle: exp.jobTitle,
      company: exp.company,
      period: exp.period,
      status: exp.status,
      responsibilities: exp.responsibilities,
      tags: exp.tags,
    });
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExperienceAction(id: string) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.delete(id);
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- ACHIEVEMENT ACTIONS ---
export async function createAchievementAction(ach: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.create({
      _type: "achievement",
      title: ach.title,
      description: ach.description,
      image: ach.image, // string for icons or URLs in fallback config
      tags: ach.tags,
      credentialUrl: ach.credentialUrl,
    });
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAchievementAction(id: string, ach: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.createOrReplace({
      _id: id,
      _type: "achievement",
      title: ach.title,
      description: ach.description,
      image: ach.image,
      tags: ach.tags,
      credentialUrl: ach.credentialUrl,
    });
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAchievementAction(id: string) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.delete(id);
    revalidatePath("/experience");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- PROJECT ACTIONS ---
export async function createProjectAction(proj: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.create({
      _type: "project",
      title: proj.title,
      description: proj.description,
      imageAssetPath: proj.image, // custom field or standard mapping
      githubUrl: proj.githubUrl,
      demoUrl: proj.demoUrl,
      tags: proj.tags,
      status: proj.status,
    });
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProjectAction(id: string, proj: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.createOrReplace({
      _id: id,
      _type: "project",
      title: proj.title,
      description: proj.description,
      imageAssetPath: proj.image,
      githubUrl: proj.githubUrl,
      demoUrl: proj.demoUrl,
      tags: proj.tags,
      status: proj.status,
      caseStudy: proj.caseStudy || undefined,
    });
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProjectAction(id: string) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.delete(id);
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- FAQ ACTIONS ---
export async function createFAQAction(faq: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.create({
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      order: 1,
    });
    revalidatePath("/faq");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFAQAction(id: string, faq: any) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.createOrReplace({
      _id: id,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 1,
    });
    revalidatePath("/faq");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFAQAction(id: string) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.delete(id);
    revalidatePath("/faq");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- MESSAGE/INBOX ACTIONS ---
export async function deleteMessageAction(id: string) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.delete(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markMessageReadAction(id: string, read: boolean) {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    await writeClient.patch(id).set({ read }).commit();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- VIEWS ACTIONS ---
export async function getViewsAction() {
  try {
    const existing = await writeClient.fetch(`*[_type == "views"][0]`);
    if (existing) {
      return { success: true, count: existing.count || 0 };
    }
    return { success: true, count: 1243 };
  } catch (error: any) {
    console.error("getViewsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementViewsAction() {
  if (!hasWriteToken()) {
    return { success: false, error: "SANITY_API_WRITE_TOKEN_MISSING" };
  }
  try {
    const existing = await writeClient.fetch(`*[_type == "views"][0]`);
    if (existing) {
      const newCount = (existing.count || 0) + 1;
      await writeClient
        .patch(existing._id)
        .set({ count: newCount })
        .commit();
      return { success: true, count: newCount };
    } else {
      await writeClient.create({
        _type: "views",
        count: 1244,
      });
      return { success: true, count: 1244 };
    }
  } catch (error: any) {
    console.error("incrementViewsAction error:", error);
    return { success: false, error: error.message };
  }
}

