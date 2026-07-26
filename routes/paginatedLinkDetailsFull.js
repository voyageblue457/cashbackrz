import Click from '../models/Click.js';
import Link from '../models/Link.js';
import Poster from '../models/Poster.js';
import Site from '../models/Site.js';

// ============================================================
// PAGINATED LINK_DETAILS FUNCTION - COPY THIS INTO routehandler.js
// REPLACE the existing export const link_details function
// ============================================================

export const link_details = async (req, res) => {
  const { id, admin } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const sites = await Site.find();

    if (admin == 1) {
      const posters = await Poster.find({ root: id });
      const posterIds = posters.map((p) => p._id);

      const query = { root: { $in: posterIds } };
      if (filter) {
        query.linkName = { $regex: filter, $options: 'i' };
      }

      let sort = { createdAt: -1 };
      if (sortBy.length > 0) {
        sort = {};
        sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
      }

      const total = await Link.countDocuments(query);
      const links = await Link.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({ path: 'root', model: 'Poster', select: 'username' })
        .lean();

      const data = links.map((link) => ({
        site: link.linkName,
        status: link.status,
        root: link.root?.username,
      }));

      return res.status(200).json({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    } else {
      const posters = await Poster.find({ root: id, active: true });
      const posterIds = posters.map((p) => p._id);

      const query = { root: { $in: posterIds } };
      if (filter) {
        query.linkName = { $regex: filter, $options: 'i' };
      }

      let sort = { createdAt: -1 };
      if (sortBy.length > 0) {
        sort = {};
        sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
      }

      const total = await Link.countDocuments(query);
      const links = await Link.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({ path: 'root', model: 'Poster', select: 'username' })
        .lean();

      const data = links.map((link) => ({
        site: link.linkName,
        status: link.status,
        root: link.root?.username,
      }));

      return res.status(200).json({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }
  } catch (e) {
    console.error('Error fetching link details:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
