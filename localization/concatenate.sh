
for project in ht-androidapp ht-iosapp ht-webapp12 feelgood-video-chats_lib
do
	echo Processing project $project ...

ls lockit*/postprocessed/*/${project}*

	echo 
	cat $(ls lockit*/postprocessed/*/${project}*) | awk -f concatenate.awk > current/${project}.xliff
done

