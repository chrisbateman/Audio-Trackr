require 'fileutils'
Dir.foreach(".") do |f|
  if (File.extname(f) == ".mp3")
    new_name = f.gsub(/.*\d\d Never Look Away /, "").gsub(" ", "-")
    FileUtils.mv(f, new_name)
  end
end