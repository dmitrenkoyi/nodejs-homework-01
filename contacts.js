const fs = require("fs/promises");
const path = require('path');
const { nanoid } = require("nanoid");

const contactsPath = path.resolve('./db/contacts.json');

const getListContacts = async () => {
  const list = await fs.readFile(contactsPath);
  const parseContacts = JSON.parse(list);
  return parseContacts;
};

const listContacts = async () => {
  const allContacts = await getListContacts();
  console.table(allContacts);
};

const getContactById = async (contactId) => {
  const contacts = await getListContacts();
  const contactById = contacts.find(item => item.id.toString() === contactId);
  if (!contactById) {
    throw new Error(`Product with id=${contactId} not found`);
  }            
  console.log(contactById);
};

const addContact = async (name, email, phone) => {
  const contacts = await getListContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await updateContacts(contacts);
  console.log(`Contact ${name} added`);
  console.table(contacts);
  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await getListContacts();
  const idx = contacts.findIndex(item => item.id.toString() === contactId);
  if (!idx) {
    throw new Error(`No contacts with id=${contactId}`);    
  }
  const newContactList = contacts.filter((_, index) => index !== idx);
  await updateContacts(newContactList);
  console.log(`Contact with id=${contactId} remove`);
  console.table(newContactList);
};

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};