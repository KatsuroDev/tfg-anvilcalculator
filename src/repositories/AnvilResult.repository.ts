import AnvilResultModel from "@/models/AnvilResultModel";

class AnvilResultRepository {
  Save(model: AnvilResultModel)
  {
    let rawResults = localStorage.getItem("anvil-results");
    let results = new Array<AnvilResultModel>();

    if (rawResults !== null)
    {
      const parsed = JSON.parse(rawResults!);
      results = parsed.map((obj: any) => AnvilResultModel.fromJson(obj));
    }

    results.push(model);

    localStorage.setItem("anvil-results", JSON.stringify(results));
  }

  Delete(uuid: string)
  {
    let rawResults = localStorage.getItem("anvil-results");
    let results = new Array<AnvilResultModel>();

    if (rawResults === null)
      return;

    const parsed = JSON.parse(rawResults!);
    results = parsed.map((obj: any) => AnvilResultModel.fromJson(obj));

    const index = results.findIndex((item: AnvilResultModel) => item.uuid === uuid);
	  results.splice(index, 1);

    localStorage.setItem("anvil-results", JSON.stringify(results));
  }

  GetAll()
  {
    let rawResults = localStorage.getItem("anvil-results");
    let results = new Array<AnvilResultModel>();

    if (rawResults === null)
        return;

    const parsed = JSON.parse(rawResults!);
    results = parsed.map((obj: any) => AnvilResultModel.fromJson(obj));

    return results;
  }
};

export default new AnvilResultRepository();
