class Controller {
  static async generateText(req, res, next) {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = { Controller };
