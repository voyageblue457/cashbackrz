// Updated get_amount_list function with pagination
export const get_amount_list = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const filter = req.query.filter || '';
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : [];

  try {
    const posterFound = await Poster.findOne({
      $or: [{ posterId: id }, { _id: id && id.length === 24 ? id : null }],
    });

    let query = {};
    if (posterFound) {
      const posterIds = [posterFound._id.toString()];
      if (posterFound.posterId && posterFound.posterId.trim() !== '') {
        posterIds.push(posterFound.posterId);
      }
      query.poster = { $in: posterIds };
    } else {
      query.poster = id;
    }

    // Add filter if provided
    if (filter) {
      query.$or = [
        { site: { $regex: filter, $options: 'i' } },
        { amount: { $regex: filter, $options: 'i' } },
      ];
    }

    // Build sort
    let sort = { createdAt: -1 };
    if (sortBy.length > 0) {
      sort = {};
      sortBy.forEach(s => { sort[s.id] = s.desc ? -1 : 1; });
    }

    // Get total count
    const total = await Amount.countDocuments(query);

    // Get paginated data
    const amounts = await Amount.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Format data
    const data = amounts.map((amount) => ({
      site: amount.site,
      amount: amount.amount,
      status: amount.status,
      createdAt: amount.createdAt,
    }));

    return res.status(200).json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    console.error('Error fetching amount list:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};
