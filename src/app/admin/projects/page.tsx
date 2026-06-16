"use client";

import { useEffect, useState } from "react";
import { mockProjects, Project } from "@/data/mockData";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageVal, setImageVal] = useState("/assets/c155164454a84dd6b1810e1e9cf79454.png");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [statusVal, setStatusVal] = useState<Project["status"]>("Active");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "project"]`)
          .then((fetched: any[]) => {
            if (fetched && fetched.length > 0) {
              const mapped = fetched.map((item) => ({
                id: item._id,
                title: item.title,
                description: item.description,
                image: item.imageAssetPath || item.image || "/assets/c155164454a84dd6b1810e1e9cf79454.png",
                tags: item.tags || [],
                githubUrl: item.githubUrl || "",
                demoUrl: item.demoUrl || "",
                status: item.status || "Active",
                caseStudy: item.caseStudy || undefined,
              }));
              setProjects(mapped);
            } else {
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch projects from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      const stored = localStorage.getItem("aaronnofrail_projects");
      if (stored) {
        try {
          setProjects(JSON.parse(stored));
        } catch (e) {
          setProjects(mockProjects);
        }
      } else {
        setProjects(mockProjects);
      }
    }
  }, []);

  const saveToStorage = (updated: Project[]) => {
    localStorage.setItem("aaronnofrail_projects", JSON.stringify(updated));
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setImageVal("/assets/c155164454a84dd6b1810e1e9cf79454.png");
    setGithubUrl("");
    setDemoUrl("");
    setTagsText("");
    setStatusVal("Active");
    setEditingId(null);
    setProblem("");
    setSolution("");
    setResult("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") return;
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImageVal(compressedBase64);
        } else {
          setImageVal(reader.result as string);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const caseStudy = {
      problem: problem.trim(),
      solution: solution.trim(),
      result: result.trim(),
    };

    if (editingId) {
      // Edit
      const updated = projects.map((proj) => {
        if (proj.id === editingId) {
          const updatedNode = {
            ...proj,
            title: title.trim().toUpperCase(),
            description: description.trim(),
            image: imageVal,
            githubUrl: githubUrl.trim() || "#",
            demoUrl: demoUrl.trim() || "#",
            tags,
            status: statusVal,
            caseStudy,
          };
          updateProjectAction(proj.id, updatedNode);
          addActivityLog(`PROJECT: Updated project configuration for '${updatedNode.title}'`, "info");
          return updatedNode;
        }
        return proj;
      });
      setProjects(updated);
      saveToStorage(updated);
    } else {
      // Add
      const newProj: Project = {
        id: `proj_${Date.now()}`,
        title: title.trim().toUpperCase(),
        description: description.trim(),
        image: imageVal,
        githubUrl: githubUrl.trim() || "#",
        demoUrl: demoUrl.trim() || "#",
        tags,
        status: statusVal,
        caseStudy,
      };
      createProjectAction(newProj);
      const updated = [...projects, newProj];
      setProjects(updated);
      saveToStorage(updated);
      addActivityLog(`PROJECT: Created new project '${newProj.title}'`, "info");
    }

    handleClear();
    // Scroll back to page top or list top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setImageVal(proj.image);
    setGithubUrl(proj.githubUrl === "#" ? "" : proj.githubUrl);
    setDemoUrl(proj.demoUrl === "#" ? "" : proj.demoUrl);
    setTagsText(proj.tags.join(", "));
    setStatusVal(proj.status);
    setProblem(proj.caseStudy?.problem || "");
    setSolution(proj.caseStudy?.solution || "");
    setResult(proj.caseStudy?.result || "");
    
    // Scroll to form
    const formElement = document.getElementById("project-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    const deletedProj = projects.find((p) => p.id === id);
    const titleStr = deletedProj ? deletedProj.title : id;
    deleteProjectAction(id);
    const updated = projects.filter((proj) => proj.id !== id);
    setProjects(updated);
    saveToStorage(updated);
    addActivityLog(`PROJECT: Deleted project '${titleStr}'`, "error");
    if (editingId === id) {
      handleClear();
    }
  };

  const presetImages = [
    { name: "Message Broker Diagram (Cream)", path: "/assets/c155164454a84dd6b1810e1e9cf79454.png" },
    { name: "Code Editor UI (Cream)", path: "/assets/3feef40f9ad84a9798bb3d3bdbcce6cc.png" },
    { name: "Decentralized Database Nodes", path: "/assets/defca9ce59df46a9b6c40796bbbc32d2.png" },
    { name: "Directory Trees CLI", path: "/assets/6b47f221e93f49b083858524f7b8791f.png" },
    { name: "Cat Mascot", path: "/assets/01_cat.png" },
  ];

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary pb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg uppercase tracking-tighter mb-2">
            Project Repository
          </h2>
          <p className="text-body-lg opacity-70 max-w-2xl">
            Manage operational entities and deployment status of internal architectures. Access source protocols and live demonstrations via the terminal grid.
          </p>
        </div>
        <button
          onClick={() => {
            handleClear();
            const formElement = document.getElementById("project-form-section");
            formElement?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-8 py-4 bg-primary text-on-primary border border-primary font-bold text-body-md hover:bg-background hover:text-primary transition-all flex items-center gap-3 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined">add</span>
          {/* Add New Project */}
          ADD NEW PROJECTS
        </button>
      </section>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj) => {
          const isEditing = editingId === proj.id;
          
          return (
            <article
              key={proj.id}
              className={`border transition-all bg-surface ${
                isEditing ? "admin-project-card-editing" : "border-primary admin-project-card-hover"
              }`}
            >
              <div className="aspect-video overflow-hidden border-b border-primary bg-primary-container relative flex items-center justify-center">
                <img
                  alt={proj.title}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity grayscale"
                  src={proj.image}
                  onError={(e) => {
                    // Fallback if local image doesn't exist
                    (e.target as HTMLImageElement).src = "/assets/01_cat.png";
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1 font-code z-10">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="bg-background text-primary border border-primary px-2.5 py-1 text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="bg-background text-error border border-error px-2.5 py-1 text-xs font-bold hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                  >
                    DEL
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-headline-md uppercase break-all">
                    {proj.title}
                  </h3>
                  <span className={`px-3 py-1 border border-primary text-label-sm font-bold uppercase tracking-widest ${
                    proj.status === "Active" 
                      ? "bg-primary text-on-primary" 
                      : proj.status === "Completed"
                      ? "bg-surface text-primary"
                      : "bg-surface-container-high text-secondary"
                  }`}>
                    {proj.status}
                  </span>
                </div>
                
                <p className="text-body-md opacity-70 mb-6 line-clamp-3 h-[60px]">
                  {proj.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 h-[64px] overflow-y-auto custom-scrollbar">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-label-sm px-2 py-1 border border-primary uppercase font-code"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center border-t border-primary pt-4 font-code">
                  <span
                    className={`text-label-sm font-bold underline flex items-center gap-1 ${
                      proj.demoUrl === "#" ? "opacity-45 cursor-not-allowed" : "hover:text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      link
                    </span>{" "}
                    VIEW DEMO
                  </span>
                  <span
                    className={`text-label-sm font-bold underline flex items-center gap-1 ${
                      proj.githubUrl === "#" ? "opacity-45 cursor-not-allowed" : "hover:text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      code
                    </span>{" "}
                    REPOSITORY
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {projects.length === 0 && (
          <div className="border border-primary border-dashed p-12 text-center text-secondary font-code md:col-span-2">
            NO_PROJECTS_DEFINED
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <section
        id="project-form-section"
        className="border-2 border-primary bg-surface mb-16 overflow-hidden"
      >
        <div className="bg-primary text-on-primary p-4 flex justify-between items-center font-code">
          <h3 className="font-headline-md text-headline-md uppercase tracking-tight">
            {editingId ? "Edit Project Configuration" : "Project Configuration"}
          </h3>
          <span className="text-label-sm opacity-60">
            {editingId ? `PROJECT_ID: ${editingId}` : "FORM_ID: P-9982-CONFIG"}
          </span>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 font-code">
            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Project Name
              </label>
              <input
                className="font-body-lg p-2 border-b border-primary focus:border-b-2 outline-none"
                placeholder="NAME"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Project Status
              </label>
              <select
                className="font-body-lg p-2 bg-transparent border-b border-primary outline-none cursor-pointer"
                value={statusVal}
                onChange={(e) => setStatusVal(e.target.value as Project["status"])}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Project Image / Vector Illustration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                {presetImages.map((pImg) => (
                  <button
                    key={pImg.path}
                    type="button"
                    onClick={() => setImageVal(pImg.path)}
                    className={`border p-2 flex flex-col items-center gap-2 cursor-pointer bg-surface hover:bg-surface-container ${
                      imageVal === pImg.path ? "border-2 border-primary" : "border-primary opacity-60"
                    }`}
                  >
                    <div className="w-full h-16 overflow-hidden flex items-center justify-center bg-primary-container">
                      <img src={pImg.path} className="w-full h-full object-cover grayscale" alt={pImg.name} />
                    </div>
                    <span className="text-[10px] text-center font-bold truncate w-full">{pImg.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <input
                  className="font-body-lg p-2 border-b border-primary focus:border-b-2 outline-none flex-grow"
                  placeholder="Or enter custom URL/path..."
                  type="text"
                  value={imageVal}
                  onChange={(e) => setImageVal(e.target.value)}
                />
                
                <label className="px-6 py-3 border border-primary text-xs font-bold uppercase cursor-pointer hover:bg-primary hover:text-on-primary transition-all font-code text-center shrink-0 flex items-center justify-center">
                  UPLOAD IMAGE
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {imageVal.startsWith("data:") && (
                <span className="text-[10px] font-bold text-green-600 uppercase font-code">
                  [ Custom Base64 Image Loaded ]
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Description
              </label>
              <textarea
                className="font-body-lg p-2 resize-none border border-primary outline-none"
                placeholder="SYSTEM_MANIFESTO..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                GitHub URL
              </label>
              <input
                className="font-body-lg p-2 border-b border-primary focus:border-b-2 outline-none"
                placeholder="https://github.com/..."
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Live Demo URL
              </label>
              <input
                className="font-body-lg p-2 border-b border-primary focus:border-b-2 outline-none"
                placeholder="https://demo.io/..."
                type="text"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                Tags (comma separated)
              </label>
              <input
                className="font-body-lg p-2 border-b border-primary focus:border-b-2 outline-none"
                placeholder="rust, webgpu, graphics..."
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </div>

            {/* Case Study Section */}
            <div className="md:col-span-2 border-t border-primary/20 pt-8 mt-4">
              <h4 className="font-headline-md text-headline-md uppercase mb-6 text-primary">
                Case Study Details (Optional)
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                    The Challenge (Problem)
                  </label>
                  <textarea
                    className="font-body-lg p-2 resize-none border border-primary outline-none"
                    placeholder="Describe the challenge or problem solved..."
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                    The Execution (Solution)
                  </label>
                  <textarea
                    className="font-body-lg p-2 resize-none border border-primary outline-none"
                    placeholder="Describe the technical solution or execution..."
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-bold uppercase tracking-widest opacity-60">
                    The Outcome (Result)
                  </label>
                  <textarea
                    className="font-body-lg p-2 resize-none border border-primary outline-none"
                    placeholder="Describe the outcome or final result..."
                    rows={2}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 flex justify-end gap-4">
              <button
                className="px-8 py-3 border border-primary hover:bg-primary hover:text-on-primary transition-all font-bold uppercase tracking-widest cursor-pointer"
                type="button"
                onClick={handleClear}
              >
                Clear / Cancel
              </button>
              <button
                className="px-10 py-3 bg-primary text-on-primary border border-primary hover:bg-background hover:text-primary transition-all font-bold uppercase tracking-widest cursor-pointer"
                type="submit"
              >
                {editingId ? "Deploy Edits" : "Deploy Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
