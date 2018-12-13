import { staat } from "./staat";

type ThisState = {
  name: string;
};

type SetName = { name: string };

export class AppState {
  public setName(currentState: ThisState, { name }: SetName): ThisState {
    return { ...currentState, name };
  }

  public setDate(
    currentState: ThisState,
    date: Date,
    timezone: string
  ): ThisState {
    return { ...currentState };
  }
}

const TheState = staat<ThisState, AppState>(AppState);
(async function() {
  const sts = new TheState();

  await sts.setName({ name: "string" });
  console.log(sts.currentState);
  await sts.setName({ name: "jeff" });
  console.log(sts.currentState);
  await sts.setName({ name: "boros" });
  console.log(sts.currentState);

  await sts.undo();
  console.log(sts.currentState);
  await sts.undo();
  console.log(sts.currentState);

  await sts.redo();
  console.log(sts.currentState);
  await sts.redo();
  console.log(sts.currentState);

  sts.currentState.name = "try";

  console.log(sts.currentState);
})();
