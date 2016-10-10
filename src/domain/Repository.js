class Repository {

  add(entity) {
    this.session.add(entity);
  }

  remove(entity) {
    this.session.remove(entity);
  }

}

export default Repository;
