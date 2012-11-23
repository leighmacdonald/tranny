from ConfigParser import ConfigParser
from os.path import exists, dirname, join, expanduser, isdir
from os import makedirs
from errno import EEXIST
from logging import getLogger
from sys import version_info
from tranny.exceptions import ConfigError

if version_info >= (3, 2):
    def mkdirp(path):
        return makedirs(path, exist_ok=True)
else:
    def mkdirp(path):
        try:
            makedirs(path)
        except OSError as err: # Python >2.5
            if err.errno == EEXIST and isdir(path):
                pass
            else:
                raise

class Configuration(ConfigParser):
    def __init__(self):
        ConfigParser.__init__(self)
        self.log = getLogger('tranny.config')

    def rules(self):
        pass

    def find_config(self, config_name="tranny.ini"):
        """ Attempt to find a configuration file to load. This function first attempts
         the users home directory standard location (~/.config/tranny). If that fails it
         moves on to configuration files in the source tree root directory.

        :param config_name:
        :type config_name:
        :return:
        :rtype:
        """
        # Try and get home dir config
        home_config = expanduser("~/.config/tranny/{0}".format(config_name))
        if exists(home_config):
            return home_config

        # Try and get project source root config
        base_path = dirname(dirname(__file__))
        config_path = join(base_path, config_name)
        if exists(config_path):
            return config_path

        # No configs were found
        return False

    def create_dirs(self):
        """ Initialize a users config directory by creating the prerequisite directories.

        :return:
        :rtype:
        """
        config_path = expanduser("~/.tranny")
        if not exists(config_path):
            mkdirp(config_path)
            self.log.info("Create new configuration path: {0}".format(config_path))

    def initialize(self, file_path=False):
        self.create_dirs()
        if not file_path:
            file_path = self.find_config()
        try:
            self.read(file_path)
        except OSError:
            raise ConfigError("No suitable configuration found")

    def find_sections(self, prefix):
        sections = [section for section in self.sections() if section.startswith(prefix)]
        return sections




