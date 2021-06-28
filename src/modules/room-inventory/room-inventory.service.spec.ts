const mockPouchDb = jest.fn();
const mockPouchDbFind = jest.fn();
jest.mock('pouchdb', () => mockPouchDb);

import { RoomInventoryService } from '@gql/module/room-inventory';

describe('RoomInventoryService', () => {
  let roomInventoryService: RoomInventoryService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPouchDb.mockImplementation(() => ({ find: mockPouchDbFind }));
    roomInventoryService = new RoomInventoryService();
  });

  describe('get()', () => {
    it('Room found', async () => {
      const mockRoom = { hotelId: 'DALPPHX', number: 123 };
      mockPouchDbFind.mockReturnValue(Promise.resolve({ docs: [mockRoom] }));

      const room = await roomInventoryService.get('DALPPHX', 123);

      expect(room).toEqual(mockRoom);
      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: 'DALPPHX', number: 123 },
      });
    });

    it('Room not found', async () => {
      mockPouchDbFind.mockReturnValue(Promise.resolve({ docs: [] }));

      await expect(roomInventoryService.get('XXXXXXX', 123)).rejects.toThrow(
        'room-inventory::XXXXXXX::123',
      );

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { hotelId: 'XXXXXXX', number: 123 },
      });
    });
  });
});
