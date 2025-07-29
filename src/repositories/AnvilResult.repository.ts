import AnvilResultModel from "@/models/AnvilResultModel";

class AnvilResultRepository {
  save(model: AnvilResultModel)
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

  delete(uuid: string)
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

  getAll()
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
