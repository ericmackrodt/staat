import { State } from "@staat/core";
import { ReactStaat } from "./types";
import makeConnect from "./connect";
import makeProvider from "./provider";

export default function reactStaat<
  TContainers extends Record<string, State<any, any>>
>(containers: TContainers): ReactStaat<TContainers> {
  return {
    Provider: makeProvider(containers),
    connect: makeConnect<TContainers>()
  };
}
