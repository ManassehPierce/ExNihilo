/* custom.js
  @author Manasseh Pierce
  @description Adds useful functions
*/

ModPE.saveWorldFile = function(filename, content) {
	java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/").mkdirs();
	var newFile = new java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/", filename);
	newFile.createNewFile();
	var outWrite = new java.io.OutputStreamWriter(new java.io.FileOutputStream(newFile));
	outWrite.append(content);
	outWrite.close();
};

ModPE.loadWorldFile = function(filename) {
	var content = "";
	if (java.io.File( android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/" + filename).exists()) {
		var file = new java.io.File(android.os.Environment.getExternalStorageDirectory().getPath() + "/games/com.mojang/minecraftWorlds/" + Level.getWorldDir() + "/" + filename),
			fos = new java.io.FileInputStream(file),
			str = new java.lang.StringBuilder(),
			ch;
		while ((ch = fos.read()) != -1) {
			str.append(java.lang.Character(ch));
		}
		content = String(str.toString());
		fos.close();
	}
	return content;
};

Level.canPlaceBlock = function(x, y, z) {
	if([0, 8, 9, 10, 11, 31, 51, 59, 90, 104, 105, 106, 141, 142, 175].indexOf(Level.getTile(x, y, z)) > 0) {
		return true;
	}
	return false;
};
