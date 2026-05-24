import aboutMeContent from "../../content/aboutMe";
import projectsContent from "../../content/projects";
import resumeContent from "../../content/resume";

export const APPS = [
  {
    id: "about-me",
    title: "About Me",
    icon: "user",
    defaultPosition: { x: 80, y: 60 },
    defaultSize: { width: 520, height: 480 },
    content: aboutMeContent,
  },
  {
    id: "projects",
    title: "Projects",
    icon: "folder",
    defaultPosition: { x: 140, y: 100 },
    defaultSize: { width: 560, height: 520 },
    content: projectsContent,
  },
  {
    id: "resume",
    title: "Resume",
    icon: "document",
    defaultPosition: { x: 200, y: 80 },
    defaultSize: { width: 600, height: 560 },
    content: resumeContent,
  },
];

export function getAppById(id) {
  return APPS.find((app) => app.id === id);
}
