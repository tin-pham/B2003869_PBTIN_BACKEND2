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

    return result.value;
  }
}

module.exports = ContactService;
