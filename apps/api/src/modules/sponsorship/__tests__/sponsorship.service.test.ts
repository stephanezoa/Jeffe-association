import { SponsorshipService } from '../sponsorship.service';

describe('SponsorshipService', () => {
  let service: SponsorshipService;

  beforeEach(() => {
    service = new SponsorshipService();
  });

  it('should instantiate sponsorship service successfully', () => {
    expect(service).toBeDefined();
  });
});
