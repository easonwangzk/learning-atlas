import type { CollectionEntry } from "astro:content";
import type { getProjects } from "@/data/projects";
import type { getResources } from "@/data/resources";
import type { getSearchIndex } from "@/data/searchIndex";
import type { tracks, trackText } from "@/data/tracks";

export type Lesson = CollectionEntry<"lessons">;
export type Project = ReturnType<typeof getProjects>[number];
export type Resource = ReturnType<typeof getResources>[number];
export type SearchItem = Awaited<ReturnType<typeof getSearchIndex>>[number];
export type Track = (typeof tracks)[number];
export type TrackText = ReturnType<typeof trackText>;
export interface LessonLink { title: string; href: string }
