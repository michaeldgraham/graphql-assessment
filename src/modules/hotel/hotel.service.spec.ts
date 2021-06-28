const mockPouchDb = jest.fn();
const mockPouchDbFind = jest.fn();
jest.mock('pouchdb', () => mockPouchDb);

import { HotelService } from '@gql/module/hotel';

describe('HotelService', () => {
  let hotelService: HotelService;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPouchDb.mockImplementation(() => ({ find: mockPouchDbFind }));
    hotelService = new HotelService();
  });

  describe('get()', () => {
    it('Hotel found', async () => {
      const mockHotel = { id: 'DALPPHX' };
      mockPouchDbFind.mockReturnValue(Promise.resolve({ docs: [mockHotel] }));

      const hotel = await hotelService.get('DALPPHX');

      expect(hotel).toEqual(mockHotel);
      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { id: 'DALPPHX' },
      });
    });

    it('Hotel not found', async () => {
      mockPouchDbFind.mockReturnValue(Promise.resolve({ docs: [] }));

      await expect(hotelService.get('XXXXXXX')).rejects.toThrow(
        'Cannot find record: hotels::XXXXXXX',
      );

      expect(mockPouchDbFind).toHaveBeenCalledWith({
        selector: { id: 'XXXXXXX' },
      });
    });
  });
});
