const { faker } = require("@faker-js/faker");
const crypto = require("crypto");

const { deterministicPartitionKey } = require("./dpk");

const _hash = data => {
  return crypto.createHash("sha3-512").update(data).digest("hex")
}

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the included partitionKey as it is if of type string and with length less than or equal to 256", () => {
    const validKey = faker.datatype.string(faker.datatype.number({ min: 1, max: 256 }));
    const outputKey = deterministicPartitionKey({
      partitionKey: validKey
    })

    expect(outputKey).toBe(validKey)
  })

  it("Returns the hash of the stringified event's data if the partitionKey is null", () => {
    const eventJSON = faker.datatype.json()
    const outputKey = deterministicPartitionKey(JSON.parse(eventJSON))

    expect(outputKey).toBe(_hash(eventJSON))
  })

  it("Returns the hash of the stringified event's data if the partitionKey has zero length", () => {
    const event = {
      partitionKey: ""
    }
    const outputKey = deterministicPartitionKey(event)

    expect(outputKey).toBe(_hash(JSON.stringify(event)))
  })

  it("Returns the hash of the partitionKey if it's length is greater than 256", () => {
    const tooLongKey = faker.datatype.string(faker.datatype.number({ min: 257 }))
    const outputKey = deterministicPartitionKey({
      partitionKey: tooLongKey
    })

    expect(outputKey).toBe(_hash(tooLongKey))
  })
});
