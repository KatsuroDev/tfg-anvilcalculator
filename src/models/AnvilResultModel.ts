import MaterialCreateModel from "./MaterialCreateModel";
import TechniqueMapper from "./TechniqueMapper";
import {v4 as uuidv4} from 'uuid';

export default class AnvilResultModel {
  uuid: string = uuidv4();
  material: string;
  steps: Array<number>;

  constructor(model: MaterialCreateModel | undefined, material: string | undefined = undefined, steps: Array<number> | undefined = undefined) {
    if (model == undefined)
    {
      this.material = material!;
      this.steps = steps!;
    }
    else
    {
      this.material = model!.material!;
      this.steps = this.CalculateSteps(model!.target!, model!.lastSteps);
    }
  }

  CalculateSteps(target: number, lastSteps: Array<number>) {
    let targetBeforeLastSteps =
      target -
      lastSteps.reduce((previous, currentValue) => {
        if (currentValue == null)
          return previous;

        return previous + currentValue;
      }, 0);

    const shrinkTime = Math.floor(targetBeforeLastSteps / 16);
    targetBeforeLastSteps -= shrinkTime * 16;

    const upsetTime = Math.floor(targetBeforeLastSteps / 13);
    targetBeforeLastSteps -= upsetTime * 13;

    const bendTime = Math.floor(targetBeforeLastSteps / 7);
    targetBeforeLastSteps -= bendTime * 7;

    const punchTime = Math.floor(targetBeforeLastSteps / 2);
    targetBeforeLastSteps -= punchTime * 2;

    let steps = new Array<number>();
    for (let i = 0; i < shrinkTime; i++) {
      steps.push(16);
    }

    for (let i = 0; i < upsetTime; i++) {
      steps.push(13);
    }

    for (let i = 0; i < bendTime; i++) {
      steps.push(7);
    }

    for (let i = 0; i < punchTime; i++) {
      steps.push(2);
    }

    if (targetBeforeLastSteps == 1) {
      steps = steps.concat(TechniqueMapper[1]);
    }

    steps = steps.concat(lastSteps.filter(item => item != null));

    return steps;
  }

  static fromJson(obj: any)
  {
    return new AnvilResultModel(undefined, obj.material, obj.steps);
  }
}
