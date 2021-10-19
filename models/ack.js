class Ack {
  constructor(data, isSuccess, error) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.error = error;
  }
}
class PagingAck {
  constructor(data, isSuccess, error, pageIndex, totalPages) {
    this.data = data;
    this.isSuccess = isSuccess;
    this.error = error;
    this.pageIndex = pageIndex;
    this.totalPages = totalPages;
  }
}

module.exports = { Ack, PagingAck };
