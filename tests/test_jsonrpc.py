import unittest
from tranny.service.broadcastthenet import BroadcastTheNet
from tranny.configuration import Configuration


class BTNAPITest(unittest.TestCase):
    def setUp(self):
        conf = Configuration()
        conf.initialize()
        self.api = BroadcastTheNet(conf)

    def test_user_info(self):
        response = self.api.user_info()
        self.assertTrue(response)

    def test_get_newest(self):
        response = self.api.get_torrents_browse(10)
        self.assertEqual(10, len(response['torrents']))

    def test_get_torrent_url(self):
        for torrent_id in self.api.get_torrents_browse(1)['torrents'].keys():
            url = self.api.get_torrent_url(torrent_id)
            self.assertTrue(torrent_id in url)

    def test_find_matches(self):
        r = []
        for release in self.api.find_matches():
            r.append(release)
        self.assertEqual(10, len(r))


if __name__ == '__main__':
    unittest.main()
