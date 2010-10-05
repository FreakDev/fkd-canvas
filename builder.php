<?php

class Builder
{

    const FILES_LIST = '~////[^/]+////~';
    const CODE_PLACEHOLDER = '//--add included code here --//';
    const CODE_TO_REMOVE = '~///[^/]+///~';
    const MODE_RELEASE = 'release';
    const MODE_DEV = 'dev';
    
    public static $basePath;
    public static $mainFile;
    public static $minify = false;
    public static $fileName;
    public static $mode;
    
    protected static $_mainCode;

    public static function init()
    {
        if (!self::$basePath)
            self::$basePath = dirname(__FILE__);
        
        if (!self::$mainFile)
            self::$mainFile = self::$basePath . '/sources/freakdev/main.js';
    }
    
    public static function build() 
    {
        
        if (!self::$fileName)
            self::$fileName = 'noname';
        
        self::init();
        
        self::$_mainCode = file_get_contents(self::$mainFile);
        
        $files = self::_findFilesToInclude();
        
        self::_cleanMainCode();        
        
        self::_includeCode($files);
                
        if ('release' == self::$mode)
        self::_genFileName();
        
        if (self::$minify)
            self::_minify();
        
        self::_output();
        
    }
    
    protected static function _includeCode($files)
    {
        $content = '';
        
        foreach($files as $file) {
            $content .= "\n\n" . file_get_contents(self::$basePath . '/' .$file);
        }
        
        self::$_mainCode = str_replace(self::CODE_PLACEHOLDER, $content, self::$_mainCode);

    }
    
    protected static function _findFilesToInclude()
    {
        // find files to include
        $splitted = preg_split(self::FILES_LIST, self::$_mainCode);
                
        $files = explode(',', $splitted[1]);
        
        unset($splitted[1]);
        self::$_mainCode = implode("\n", $splitted);
                        
        $cleanFiles = array();
        foreach ($files as $file) {
            $file = trim($file, "'\n \t");
            $file = str_replace('.', DIRECTORY_SEPARATOR, $file);
            $cleanFiles[] = $file . '.js';
        }
        
        return $cleanFiles;
    }
    
    protected static function _cleanMainCode()
    {
        $splitted = preg_split(self::CODE_TO_REMOVE, self::$_mainCode);
        unset($splitted[1]);
        self::$_mainCode = implode("\n", $splitted);
    }    
    
    protected function _genFileName()
    {
        $ver = trim(substr(self::$_mainCode, 0, strpos(self::$_mainCode, "\n")));
        
        if ('version' == substr($ver, 0, 9)) {
            self::$fileName .= '-' . trim(substr($ver, strpos($ver, ' '))); 
        }
    }

    // doesn't work properly
    protected static function _minify()
    {
        /* remove comments */
        self::$_mainCode = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', self::$_mainCode);
        self::$_mainCode = preg_replace('!//[^\n]*!', '', self::$_mainCode);
        
        /* remove tabs, spaces, newlines, etc. */
        self::$_mainCode = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', self::$_mainCode);
    }
    
    protected static function _output()
    {
        file_put_contents(self::$basePath . '/' . self::$fileName . '.js', self::$_mainCode);
    }
}


Builder::$fileName = 'freakdev';
Builder::$mode = Builder::MODE_DEV;
Builder::build();
    