import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  AUTH0_CLIENT_ID,
  AUTH0_LOGOUT_URL,
  AUTH0_RETURN_TO_URL,
} from "~/constants/index.server";
import { destroySession, getSession, auth } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const profile = await auth.isAuthenticated(request, {
    successRedirect: "/private",
    failureRedirect: "/",
  });

  return json({ profile });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const logoutURL = new URL(AUTH0_LOGOUT_URL);

  logoutURL.searchParams.set("client_id", AUTH0_CLIENT_ID);
  logoutURL.searchParams.set("returnTo", AUTH0_RETURN_TO_URL);

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
