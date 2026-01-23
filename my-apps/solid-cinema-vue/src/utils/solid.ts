import { Session } from "@inrupt/solid-client-authn-browser";

import {
  getSolidDataset,
  getThing,
  getUrlAll,
  getContainedResourceUrlAll,
  SolidDataset
} from "@inrupt/solid-client";


const session = new Session();

export async function solidLogin(issuer: string): Promise<void> {
  await session.login({
    redirectUrl: window.location.href,
    oidcIssuer: issuer,
    clientName: "Solid Cinema App",
  });
}
export async function solidLogout() {
  if (session.info.isLoggedIn) {
    await session.logout();
    window.location.href = "/";
  }
}

export async function handleRedirect(): Promise<boolean> {
  await session.handleIncomingRedirect({ restorePreviousSession: true });
  return session.info.isLoggedIn;
}

export function solidSession(): Session {
  return session;
}


export async function listMyPods(): Promise<string[]> {
  if (!session.info.isLoggedIn) return [];

  const webId = session.info.webId!;
  const profileDataset = await getSolidDataset(webId, { fetch: session.fetch });
  const profileThing = getThing(profileDataset, webId);

  if (!profileThing) {
    return [];
  }

  const podUrls = getUrlAll(profileThing, "http://www.w3.org/ns/pim/space#storage");
  return podUrls;
}

export async function loadMovies(podUrl: string): Promise<MovieItem[]> {
  const playlistUrl = `${podUrl}/movies/`;

  try {
    const dataset: SolidDataset = await getSolidDataset(playlistUrl, {
      fetch: solidSession().fetch,
    });

    const urls = getContainedResourceUrlAll(dataset);

    return urls.map((u) => {
      const name = decodeURIComponent(u.split("/").pop() ?? "");
      return { url: u, name };
    });

  } catch (err) {
    console.error("Error loading movies:", err);
    return [];
  }
}
