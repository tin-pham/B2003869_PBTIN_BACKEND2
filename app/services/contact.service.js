const { ObjectId } = require('mongodb');

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection('contacts');
  }

  static extractContactData = (data) => {
    const contact = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      favorite: data.favorite,
    };

    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key],
    );
    return contact;
  };

  async create(payload) {
    const contact = ContactService.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      {
        $set: { favorite: contact.favorite === true },
      },
      {
        returnDocument: 'after',
        upsert: true,
      },
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return cursor.toArray();
  }

  async findByName(name) {
    return this.find({
      name: { $regex: new RegExp(name), $options: 'i' },
    });
  }

  async findById(id) {
    return this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = ContactService.extractContactData(payload);

    const result = await this.Contact.findOneAndUpdate(
      filter,
      {
        $set: update,
      },
      {
        returnDocument: 'after',
      },
    );

    return result;
  }

  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });

    return !!result;
  }

  async findFavorite() {
    return this.find({ favorite: true });
  }

  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    console.log(result);
    return result.deletedCount;
  }
}

module.exports = ContactService;
