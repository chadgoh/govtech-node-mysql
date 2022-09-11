module.exports = {
  mockRequest: (req) => {
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.headers = jest.fn().mockReturnValue(req);
    return req;
  },

  mockResponse: () => {
    const res = {
      status: 200,
      json: { hello: "world" },
    };
    // replace the following () => res
    // with your function stub/mock of choice
    // making sure they still return `res`
    res.status.send = () => res;
    res.json = () => res;
    return res;
  },
};
