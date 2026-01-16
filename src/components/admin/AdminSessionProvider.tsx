"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/lib/siteContentTypes";
import type { PageContent } from "@/lib/pageContent";

type AdminSessionContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  siteContent: SiteContent | null;
  setSiteContent: (content: SiteContent) => void;
  refreshSession: (options?: { showLoader?: boolean }) => Promise<void>;
  pageContentBySlug: Record<string, PageContent>;
  pageContentLoadingBySlug: Record<string, boolean>;
  refreshPageContent: (
    slug: string,
    options?: { showLoader?: boolean }
  ) => Promise<void>;
  setPageContentForSlug: (slug: string, content: PageContent) => void;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

const ADMIN_CACHE_TTL_MS = 30_000;
let cachedSiteContent: SiteContent | null = null;
let cachedSiteContentAt = 0;
const cachedPageContent = new Map<string, PageContent>();
const cachedPageContentAt = new Map<string, number>();

export const AdminSessionProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [pageContentBySlug, setPageContentBySlug] = useState<
    Record<string, PageContent>
  >({});
  const [pageContentLoadingBySlug, setPageContentLoadingBySlug] = useState<
    Record<string, boolean>
  >({});

  const refreshSession = useCallback(
    async ({ showLoader = false }: { showLoader?: boolean } = {}) => {
      const now = Date.now();
      const isSiteFresh =
        cachedSiteContent && now - cachedSiteContentAt < ADMIN_CACHE_TTL_MS;
      if (showLoader) {
        setIsLoading(true);
      }
      try {
        const [sessionRes, contentRes] = await Promise.all([
          fetch("/api/admin/session", { cache: "no-store" }),
          isSiteFresh
            ? Promise.resolve(
                new Response(JSON.stringify(cachedSiteContent), { status: 200 })
              )
            : fetch("/api/admin/content", { cache: "no-store" }),
        ]);
        const session = await sessionRes.json();
        setIsAuthenticated(Boolean(session.authenticated));

        if (contentRes.ok) {
          const contentData = (await contentRes.json()) as SiteContent;
          cachedSiteContent = contentData;
          cachedSiteContentAt = now;
          setSiteContent(contentData);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setHasLoaded(true);
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!hasLoaded) {
      refreshSession({ showLoader: true });
    }
  }, [hasLoaded, refreshSession]);

  const refreshPageContent = useCallback(
    async ({ slug, showLoader = false }: { slug: string; showLoader?: boolean }) => {
      const now = Date.now();
      const cached = cachedPageContent.get(slug);
      const cachedAt = cachedPageContentAt.get(slug) ?? 0;
      const isFresh = cached && now - cachedAt < ADMIN_CACHE_TTL_MS;
      if (showLoader) {
        setPageContentLoadingBySlug((prev) => ({ ...prev, [slug]: true }));
      }
      try {
        let data: PageContent | null = null;
        if (isFresh) {
          data = cached;
        } else {
          const response = await fetch(`/api/admin/pages/${slug}`, {
            cache: "no-store",
          });
          if (!response.ok) {
            return;
          }
          data = (await response.json()) as PageContent;
        }
        if (data) {
          cachedPageContent.set(slug, data);
          cachedPageContentAt.set(slug, now);
          setPageContentBySlug((prev) => ({ ...prev, [slug]: data }));
        }
      } finally {
        setPageContentLoadingBySlug((prev) => ({ ...prev, [slug]: false }));
      }
    },
    []
  );

  const setSiteContentCached = useCallback((content: SiteContent) => {
    cachedSiteContent = content;
    cachedSiteContentAt = Date.now();
    setSiteContent(content);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      siteContent,
      setSiteContent: setSiteContentCached,
      refreshSession,
      pageContentBySlug,
      pageContentLoadingBySlug,
      refreshPageContent: (slug: string, options?: { showLoader?: boolean }) =>
        refreshPageContent({ slug, showLoader: options?.showLoader }),
      setPageContentForSlug: (slug: string, content: PageContent) => {
        cachedPageContent.set(slug, content);
        cachedPageContentAt.set(slug, Date.now());
        setPageContentBySlug((prev) => ({ ...prev, [slug]: content }));
      },
    }),
    [
      isAuthenticated,
      isLoading,
      siteContent,
      setSiteContentCached,
      refreshSession,
      pageContentBySlug,
      pageContentLoadingBySlug,
      refreshPageContent,
    ]
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
};

export const useAdminSession = () => {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return context;
};
