# YAML  -  yet another markup language

## YAML is a digestible data serialization language often used to create configuration files with any programming language. 
## YAML is superset of json, so it can do everything that JSON can do and more.

## Main COmponents of YAML are -

**1. YAML Key - Value Pair : just like json, yaml has key value pair to be used 'key:value',            This yaml file supports all kind of data types like integer, float, string, boolean, date(ISO format) etc. We can pass multiple words in single quotes and if have special character like bracket[]{},\ in string and sentence then it must be pass with double quotes.**

2. YAML List/Array - List intend with dash, dash indicates that it's element of an array, all members of 
            list starts with dash(-), There are 2 sequences to write list
            1. Block Sequence - each entry with dash and space
            example -->
            person:
                - chetan
                - akshay
                - nikhil
            2. Flow sequence - comma separated list within square brackets(like an array)
            example -->
            person: [chetan, akshay, nikhil]                

3. YAML Directories/Map - set of properties group together under one item (generally first item in 
            indentation below that we keep our list of properties) with "colon" and all list below it, it contains key value pair
            example -->
            dictionary_node:
                dir_item1:
                    key: value
                dir_itme2:
                    key: value

(**** Most important difference in dictionary and list is list start with dash and so dictionary not****)

4. List containing directories - under block sequence dictionary item has list of directories
            example --->
            List_node:
                - dir_1:
                    key1:value1
                    key11:value11
                - dir_2:
                    key2:value2

5. List containing directories lists - under block sequence dictionary item has list of directories and 
            that directories also explaining about it with list
            example --->
            List_node:
                - dir_1:
                    key1:value1
                    key2:value2
                    list_node:
                        - val1
                        - val2
                        - val3
                - dir_2:
                    key3:value3
                    key4:value4
                    key3:[val1,val2,val3]

6. YAML Pipe - pipe notation (|) also referred as literal blocks, it is used to write and print literals
            text as it is with new lines spaces and (multiple lines) in YAML file and print it 
            example --->
            dictionary_node:
                - list_node:
                    key1: value1
                    address: |
                        Post, village
                        Tq, dist
                        state, country,
                        postal_code

7. YAML Greater Than Sign(>) - this is referred as folded block, it will render text as single line, 
            you can write multiple lines in YAML but all will merge in single line at the time of print.
            example --->
            dictionary_node:
                - list_node:
                    key1: value1
                    address: >
                        Post, village
                        Tq, dist
                        state, country,
                        postal_code
                        (this all will print like single line - Post, village Tq, dist state, country,  postal_code )

**8. YAML Comments - comments are make using '#'**

**9. YAML Indentation - this all file carry strict indentation which is may be 2 spaces or 4 spaces(tab) but we must follow the indentation. Spacing is very important in YAML.**