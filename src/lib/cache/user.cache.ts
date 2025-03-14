import { getUser } from "@/actions/user.action";

import { cache } from "react";

export const cachedUser = cache(() => getUser());
