import { WebsiteContent } from "../models/Content.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getContent = async (req, res) => {
  try {
    const query = req.query.page ? { page: req.query.page } : {};
    const content = await WebsiteContent.find(query);
    const structured = {};
    content.forEach(({ page, section, key, value }) => {
      if (!structured[page]) structured[page] = {};
      if (!structured[page][section]) structured[page][section] = {};
      structured[page][section][key] = value;
    });
    return successResponse(res, 200, "Content retrieved", { content: structured });
  } catch (e) { return errorResponse(res, 500, e.message); }
};

export const updateContent = async (req, res) => {
  try {
    const { page, section, key } = req.params;
    const { value } = req.body;
    const content = await WebsiteContent.findOneAndUpdate({ page, section, key }, { value }, { new: true, upsert: true });
    return successResponse(res, 200, "Content updated", { content });
  } catch (e) { return errorResponse(res, 500, e.message); }
};
